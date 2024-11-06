import { inngest } from '../../client';
import { NonRetriableError } from 'inngest';
import { env } from '../../../env';
import { db } from '../../../server/db';
import { fetchTinyBird } from '../../../server/api/routers/tinybird';
import {
  basePath,
  TargetingSegment,
} from '../../../server/api/routers/tinybird/targeting-segments';

import { uploadToS3 } from '../../../../src/server/s3';

import {
  Advertiser,
  advertisers,
  auditCampaigns,
  campaigns,
  Campaign,
  Creative,
  Pixel,
  TargetingGroup,
  targetingGroups,
  budgetTypeEnum,
  auditLineitems,
  optionsVendorFees,
  environmentEnum,
} from '@limelight/shared-drizzle';
import { AnyBlock } from '@slack/types';
import { and, eq } from 'drizzle-orm';
import { format } from 'date-fns';
import {
  beeswaxCampaignResponse,
  beeswaxLineItemResponse,
  padAltId,
} from '@limelight/shared-utils/beeswax/beeswax';
import { writeTargetingGroupToSlack } from '../targeting-groups/targeting-groups';
import { advertiserCreated } from '../advertisers/advertisers';
import { writeToSlack } from '../slack';

// TODO: make tests for this function
export const campaignCreated = inngest.createFunction(
  { id: 'campaigns-campaign-created' },
  { event: 'campaigns/campaign.created' },
  async ({ event, step }) => {
    const campaignID = event.data.id;
    const campaignName = event.data.name;

    if (!campaignID) throw new NonRetriableError('Campaign ID is missing');
    if (!campaignName) throw new NonRetriableError('Campaign name is missing');

    const now = new Date();
    const startDate = new Date(event.data.start_date);
    const endDate = new Date(event.data.end_date);
    let frequencyDuration = 0;
    if (event.data.frequency_period === 'day') {
      frequencyDuration = 86400;
    } else if (event.data.frequency_period === 'week') {
      frequencyDuration = 604800;
    }

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    let environment: (typeof environmentEnum.enumValues)[number] = 'dev';
    if (env.BRANCH === 'main') {
      environment = 'prod';
    }

    const advertiser = await step.run(
      'Check to see if the advertiser for the campaign exists',
      async () => {
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        return dbResultAdvertiser[0];
      },
    );

    if (!advertiser?.externalId) {
      await step.invoke('Create the advertiser', {
        function: advertiserCreated,
        data: {
          alt_id: advertiser.altId,
          id: advertiser.id,
          industry: advertiser.industry,
          name: advertiser.name,
          website: advertiser.website,
          user_id: '',
        },
      });
    }

    await step.run('Create campaign in beeswax', async () => {
      // Get advertiser external ID
      const dbResult = await db
        .select({ externalId: advertisers.externalId })
        .from(advertisers)
        .where(eq(advertisers.id, event.data.advertiser_id));
      const advertiserExternalId = dbResult[0].externalId;

      if (!advertiserExternalId) {
        throw new NonRetriableError('Advertiser external ID is missing');
      }

      const [lifetimeSpend, dailySpend] = getSpendValues(
        event.data.budget_type,
        event.data.budget,
        startDate,
        endDate,
      );

      // Update beeswax sync status to 'pending'
      await db
        .update(campaigns)
        .set({
          beeswaxSync: 'pending',
        })
        .where(eq(campaigns.id, campaignID));

      // Get vendor fees
      const dbResultVendorFees = await db
        .select({
          name: optionsVendorFees.name,
          beeswaxId: optionsVendorFees.beeswaxId,
        })
        .from(optionsVendorFees)
        .where(
          and(
            eq(optionsVendorFees.environment, environment),
            eq(optionsVendorFees.level, 'campaign'),
          ),
        );

      const vendorFees: {
        name: string;
        vendor: string;
        vendor_id: number;
      }[] = [];
      dbResultVendorFees.forEach((result) => {
        vendorFees.push({
          name: result.name,
          vendor: result.name,
          vendor_id: result.beeswaxId,
        });
      });

      const request = JSON.stringify({
        name: campaignName,
        advertiser_id: parseInt(advertiserExternalId),
        budget_type: 'spend including vendor fees',
        spend_budget: {
          lifetime: lifetimeSpend,
          daily: dailySpend,
        },
        start_date: startDate
          ? format(
              startDate.toLocaleString('en-US', {
                timeZone: 'America/New_York',
              }),
              'yyyy-MM-dd HH:mm:ss',
            )
          : null,
        end_date: endDate
          ? format(
              endDate.toLocaleString('en-US', {
                timeZone: 'America/New_York',
              }),
              'yyyy-MM-dd HH:mm:ss',
            )
          : null,
        alternative_id: padAltId(event.data.alt_id, 'skybeam'),
        notes:
          'Updated from Skybeam ' +
          now.toLocaleDateString() +
          ' ' +
          now.toTimeString(),
        vendor_fees: vendorFees,
        frequency_caps: {
          id_type: 'STANDARD',
          use_fallback: true,
          limits: [
            {
              duration: frequencyDuration,
              impressions: event.data.frequency,
            },
          ],
        },
      });

      const response = await fetch(`${env.BEESWAX_URL}/rest/v2/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
          ).toString('base64')}`,
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: request,
      });

      if (!response.ok) {
        // Update beeswax sync status to 'failure'
        await db
          .update(campaigns)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(campaigns.id, campaignID));
        // Insert an audit campaign row
        const body = await response.json();
        await db.insert(auditCampaigns).values({
          id: campaignID,
          requestBody: request,
          responseBody: JSON.stringify(body),
          statusCode: response.status,
          httpMethod: 'POST',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });
        // TODO: notify sentry?
        // TODO: notify user with email or pop-up
        throw new NonRetriableError(
          `Failed to call beeswax API for campaign ${campaignName}`,
        );
      }

      // should be 201
      const responseData: beeswaxCampaignResponse = await response.json();

      /**
       * Insert an audit campaign row
       */
      await db.insert(auditCampaigns).values({
        id: campaignID,
        requestBody: request,
        responseBody: JSON.stringify(responseData),
        statusCode: response.status,
        httpMethod: 'POST',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // Update campaign external ID with beeswax ID & set beeswax sync status to 'success'
      return db
        .update(campaigns)
        .set({
          beeswaxSync: 'success',
          externalId: String(responseData.id),
        })
        .where(eq(campaigns.id, campaignID))
        .returning({
          id: campaigns.id,
          beeswaxSync: campaigns.beeswaxSync,
        });
    });
  },
);

// TODO: make tests for this function
export const campaignUpdated = inngest.createFunction(
  { id: 'campaigns-campaign-updated' },
  { event: 'campaigns/campaign.updated' },
  async ({ event, step }) => {
    const campaignID = event.data.id;
    const campaignName = event.data.name;

    if (!campaignID) throw new NonRetriableError('Campaign ID is missing');
    if (!campaignName) throw new NonRetriableError('Campaign name is missing');

    const now = new Date();
    const startDate = new Date(event.data.start_date);
    const endDate = new Date(event.data.end_date);
    let frequencyDuration = 0;
    if (event.data.frequency_period === 'day') {
      frequencyDuration = 86400;
    } else if (event.data.frequency_period === 'week') {
      frequencyDuration = 604800;
    }

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    let environment: (typeof environmentEnum.enumValues)[number] = 'dev';
    if (env.BRANCH === 'main') {
      environment = 'prod';
    }

    const advertiser = await step.run(
      'Check to see if the advertiser for the campaign exists',
      async () => {
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        return dbResultAdvertiser[0];
      },
    );

    if (!advertiser?.externalId) {
      await step.invoke('Create the advertiser', {
        function: advertiserCreated,
        data: {
          alt_id: advertiser.altId,
          id: advertiser.id,
          industry: advertiser.industry,
          name: advertiser.name,
          website: advertiser.website,
          user_id: '',
        },
      });
    }

    const campaign = await step.run(
      'Check to see if the campaign exists',
      async () => {
        const dbResults = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, campaignID));
        return dbResults[0];
      },
    );

    if (!campaign?.externalId) {
      await step.invoke('Create the campaign', {
        function: campaignCreated,
        data: event.data,
      });
    }

    const updatedCampaigns = await step.run(
      'Update campaign in beeswax',
      async () => {
        // TODO: UI should not allow updates if status is 'pending' (or 'failure'?)

        const dbResult = await db
          .select({
            externalId: campaigns.externalId,
            budgetType: campaigns.budgetType,
            status: campaigns.status,
          })
          .from(campaigns)
          .where(eq(campaigns.id, campaignID));
        const campaign = dbResult[0];

        if (!campaign.externalId)
          throw new NonRetriableError('External ID is missing');

        // Get advertiser external ID
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        const advertiser = dbResultAdvertiser[0];
        const advertiserExternalId = advertiser.externalId;

        if (!advertiserExternalId)
          throw new NonRetriableError('Advertiser external ID is missing');

        const [lifetimeSpend, dailySpend] = getSpendValues(
          event.data.budget_type,
          event.data.budget,
          startDate,
          endDate,
        );

        // Update beeswax sync status to 'pending'
        await db
          .update(campaigns)
          .set({
            beeswaxSync: 'pending',
          })
          .where(eq(campaigns.id, campaignID));

        // --------------------------------------------------
        // Targeting Groups
        // --------------------------------------------------

        // If the campaign is published, get targeting group IDs.
        // Beeswax insists that we send end date for lifetime budget line items, and we want to
        //  ensure that the line item dates are aligned with campaign dates once its live.
        if (campaign.status === 'published') {
          const dbResultTargetingGroups = await db
            .select({
              id: targetingGroups.id,
              name: targetingGroups.name,
              externalId: targetingGroups.externalId,
            })
            .from(targetingGroups)
            .where(eq(targetingGroups.campaignId, campaignID));

          for (const tg of dbResultTargetingGroups) {
            const request = JSON.stringify({
              campaign_id: campaign.externalId,
              name: tg.name,
              active: true,
              start_date: startDate
                ? format(
                    startDate.toLocaleString('en-US', {
                      timeZone: 'America/New_York',
                    }),
                    'yyyy-MM-dd HH:mm:ss',
                  )
                : null,
              end_date: endDate
                ? format(
                    endDate.toLocaleString('en-US', {
                      timeZone: 'America/New_York',
                    }),
                    'yyyy-MM-dd HH:mm:ss',
                  )
                : null,
              type: 'video',
              notes:
                'Updated from Skybeam ' +
                now.toLocaleDateString() +
                ' ' +
                now.toTimeString(),
            });

            const response = await fetch(
              `${env.BEESWAX_URL}/rest/v2/line-items/${tg.externalId}`,
              {
                method: 'PATCH',
                headers: {
                  Authorization: `Basic ${Buffer.from(
                    env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
                  ).toString('base64')}`,
                  accept: 'application/json',
                  'content-type': 'application/json',
                },
                body: request,
              },
            );

            if (!response.ok) {
              // Update beeswax sync status to 'failure'
              await db
                .update(campaigns)
                .set({
                  beeswaxSync: 'failure',
                })
                .where(eq(campaigns.id, campaignID));
              // Insert an audit line item row
              const body = await response.json();
              await db.insert(auditLineitems).values({
                id: tg.id,
                requestBody: request,
                responseBody: JSON.stringify(body),
                statusCode: response.status,
                httpMethod: 'PATCH',
                userId: event.data.user_id,
                dsp: 'beeswax',
              });
              // TODO: notify sentry?
              // TODO: notify user with email or pop-up
              throw new NonRetriableError(
                `Failed to call beeswax API PATCH for targeting group ${tg.name}`,
              );
            }

            // should be 200
            const responseData: beeswaxLineItemResponse = await response.json();

            /**
             * Insert an audit line item row
             */
            await db.insert(auditLineitems).values({
              id: tg.id,
              requestBody: request,
              responseBody: JSON.stringify(responseData),
              statusCode: response.status,
              httpMethod: 'PATCH',
              userId: event.data.user_id,
              dsp: 'beeswax',
            });
          }
        }

        // --------------------------------------------------
        // Campaign
        // --------------------------------------------------

        // Get vendor fees
        const dbResultVendorFees = await db
          .select({
            name: optionsVendorFees.name,
            beeswaxId: optionsVendorFees.beeswaxId,
          })
          .from(optionsVendorFees)
          .where(
            and(
              eq(optionsVendorFees.environment, environment),
              eq(optionsVendorFees.level, 'campaign'),
            ),
          );

        const vendorFees: {
          name: string;
          vendor: string;
          vendor_id: number;
        }[] = [];
        dbResultVendorFees.forEach((result) => {
          vendorFees.push({
            name: result.name,
            vendor: result.name,
            vendor_id: result.beeswaxId,
          });
        });

        const request = JSON.stringify({
          name: campaignName,
          advertiser_id: parseInt(advertiserExternalId),
          budget_type: 'spend including vendor fees',
          spend_budget: {
            lifetime: lifetimeSpend,
            daily: dailySpend,
          },
          start_date: startDate
            ? format(
                startDate.toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                }),
                'yyyy-MM-dd HH:mm:ss',
              )
            : null,
          end_date: endDate
            ? format(
                endDate.toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                }),
                'yyyy-MM-dd HH:mm:ss',
              )
            : null,
          alternative_id: padAltId(event.data.alt_id, 'skybeam'),
          notes:
            'Updated from Skybeam ' +
            now.toLocaleDateString() +
            ' ' +
            now.toTimeString(),
          vendor_fees: vendorFees,
          frequency_caps: {
            id_type: 'STANDARD',
            use_fallback: true,
            limits: [
              {
                duration: frequencyDuration,
                impressions: event.data.frequency,
              },
            ],
          },
        });

        const response = await fetch(
          `${env.BEESWAX_URL}/rest/v2/campaigns/${campaign.externalId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Basic ${Buffer.from(
                env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
              ).toString('base64')}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: request,
          },
        );

        if (!response.ok) {
          // Update beeswax sync status to 'failure'
          await db
            .update(campaigns)
            .set({
              beeswaxSync: 'failure',
            })
            .where(eq(campaigns.id, campaignID));
          // Insert an audit campaign row
          const body = await response.json();
          await db.insert(auditCampaigns).values({
            id: campaignID,
            requestBody: request,
            responseBody: JSON.stringify(body),
            statusCode: response.status,
            httpMethod: 'PUT',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
          // TODO: notify sentry?
          // TODO: notify user with email or pop-up
          throw new NonRetriableError(
            `Failed to call beeswax API for campaign ${campaignName}`,
          );
        }

        // should be 200
        const responseData: beeswaxCampaignResponse = await response.json();

        /**
         * Insert an audit campaign row
         */
        await db.insert(auditCampaigns).values({
          id: campaignID,
          requestBody: request,
          responseBody: JSON.stringify(responseData),
          statusCode: response.status,
          httpMethod: 'PUT',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });

        // Update beeswax sync status to 'success'
        return db
          .update(campaigns)
          .set({
            beeswaxSync: 'success',
          })
          .where(eq(campaigns.id, campaignID))
          .returning({
            id: campaigns.id,
            beeswaxSync: campaigns.beeswaxSync,
          });
      },
    );

    if (
      updatedCampaigns[0] &&
      updatedCampaigns[0].id &&
      updatedCampaigns[0].beeswaxSync === 'success'
    ) {
      await step.invoke('Upload the campaign to S3', {
        function: writeCampaignToS3,
        data: { id: updatedCampaigns[0].id },
      });
    }
  },
);

// TODO: make tests for this function
export const campaignActivated = inngest.createFunction(
  { id: 'campaigns-campaign-activated' },
  { event: 'campaigns/campaign.activated' },
  async ({ event, step }) => {
    const campaignID = event.data.id;
    const campaignName = event.data.name;
    const { user_id } = event.data;

    if (!campaignID) throw new NonRetriableError('Campaign ID is missing');
    if (!campaignName) throw new NonRetriableError('Campaign name is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    const advertiser = await step.run(
      'Check to see if the advertiser for the campaign exists',
      async () => {
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        return dbResultAdvertiser[0];
      },
    );

    if (!advertiser?.externalId) {
      await step.invoke('Create the advertiser', {
        function: advertiserCreated,
        data: {
          alt_id: advertiser.altId,
          id: advertiser.id,
          industry: advertiser.industry,
          name: advertiser.name,
          website: advertiser.website,
          user_id: '',
        },
      });
    }

    const campaignData = await step.run(
      'Check to see if the campaign exists',
      async () => {
        const dbResults = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, campaignID));
        return dbResults[0];
      },
    );

    if (!campaignData?.externalId) {
      await step.invoke('Create the campaign', {
        function: campaignCreated,
        data: {
          id: campaignData.id,
          name: campaignData.name,
          budget: campaignData.budget,
          budget_type: campaignData.budgetType,
          advertiser_id: campaignData.advertiserId,
          start_date: new Date(campaignData.startDate),
          end_date: new Date(campaignData.endDate),
          alt_id: campaignData.altId,
          frequency: campaignData.frequency,
          frequency_period: campaignData.frequencyPeriod,
          user_id: '',
        },
      });
    }

    const activatedCampaigns = await step.run(
      'Activate campaign & associated targeting groups in beeswax',
      async () => {
        const dbResult = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, campaignID));
        const campaign = dbResult[0];
        const externalId = campaign.externalId;
        const startDate = new Date(campaign.startDate);
        const endDate = new Date(dbResult[0].endDate);

        if (!externalId) throw new NonRetriableError('External ID is missing');

        // Get advertiser external ID
        const dbResultAdvertiser = await db
          .select({ externalId: advertisers.externalId })
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        const advertiserExternalId = dbResultAdvertiser[0].externalId;
        if (!advertiserExternalId) {
          throw new NonRetriableError('Advertiser external ID is missing');
        }
        // Update beeswax sync status to 'pending'
        await db
          .update(campaigns)
          .set({
            beeswaxSync: 'pending',
          })
          .where(eq(campaigns.id, campaignID));

        // --------------------------------------------------
        // Targeting Groups
        // --------------------------------------------------

        const dbResultTargetingGroups = await db
          .select({
            id: targetingGroups.id,
            name: targetingGroups.name,
            externalId: targetingGroups.externalId,
          })
          .from(targetingGroups)
          .where(eq(targetingGroups.campaignId, campaignID));

        for (const tg of dbResultTargetingGroups) {
          const request = JSON.stringify({
            campaign_id: externalId,
            name: tg.name,
            active: true,
            start_date: startDate
              ? format(
                  startDate.toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                  }),
                  'yyyy-MM-dd HH:mm:ss',
                )
              : null,
            end_date: endDate
              ? format(
                  endDate.toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                  }),
                  'yyyy-MM-dd HH:mm:ss',
                )
              : null,
            type: 'video',
            notes:
              'Updated from Skybeam ' +
              now.toLocaleDateString() +
              ' ' +
              now.toTimeString(),
          });

          const response = await fetch(
            `${env.BEESWAX_URL}/rest/v2/line-items/${tg.externalId}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Basic ${Buffer.from(
                  env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
                ).toString('base64')}`,
                accept: 'application/json',
                'content-type': 'application/json',
              },
              body: request,
            },
          );

          if (!response.ok) {
            // Update beeswax sync status to 'failure'
            await db
              .update(campaigns)
              .set({
                beeswaxSync: 'failure',
              })
              .where(eq(campaigns.id, campaignID));
            // Insert an audit line item row
            const body = await response.json();
            await db.insert(auditLineitems).values({
              id: tg.id,
              requestBody: request,
              responseBody: JSON.stringify(body),
              statusCode: response.status,
              httpMethod: 'PATCH',
              userId: event.data.user_id,
              dsp: 'beeswax',
            });
            // TODO: notify sentry?
            // TODO: notify user with email or pop-up
            throw new NonRetriableError(
              `Failed to call beeswax API PATCH for targeting group ${tg.name}`,
            );
          }

          // should be 200
          const responseData: beeswaxLineItemResponse = await response.json();

          /**
           * Insert an audit line item row
           */
          await db.insert(auditLineitems).values({
            id: tg.id,
            requestBody: request,
            responseBody: JSON.stringify(responseData),
            statusCode: response.status,
            httpMethod: 'PATCH',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
        }

        // --------------------------------------------------
        // Campaign
        // --------------------------------------------------

        const request = JSON.stringify({
          name: campaignName,
          advertiser_id: parseInt(advertiserExternalId),
          active: true,
          alternative_id: padAltId(event.data.alt_id, 'skybeam'),
          notes:
            'Updated from Skybeam ' +
            now.toLocaleDateString() +
            ' ' +
            now.toTimeString(),
        });

        const response = await fetch(
          `${env.BEESWAX_URL}/rest/v2/campaigns/${externalId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Basic ${Buffer.from(
                env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
              ).toString('base64')}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: request,
          },
        );

        if (!response.ok) {
          // Update beeswax sync status to 'failure'
          await db
            .update(campaigns)
            .set({
              beeswaxSync: 'failure',
            })
            .where(eq(campaigns.id, campaignID));
          // Insert an audit campaign row
          const body = await response.json();
          await db.insert(auditCampaigns).values({
            id: campaignID,
            requestBody: request,
            responseBody: JSON.stringify(body),
            statusCode: response.status,
            httpMethod: 'PATCH',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
          // TODO: notify sentry?
          // TODO: notify user with email or pop-up
          throw new NonRetriableError(
            `Failed to call beeswax API for campaign ${campaignName}`,
          );
        }

        // should be 200
        const responseData: beeswaxCampaignResponse = await response.json();

        /**
         * Insert an audit campaign row
         */
        await db.insert(auditCampaigns).values({
          id: campaignID,
          requestBody: request,
          responseBody: JSON.stringify(responseData),
          statusCode: response.status,
          httpMethod: 'PATCH',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });

        // Update beeswax sync status to 'success'
        return db
          .update(campaigns)
          .set({
            beeswaxSync: 'success',
          })
          .where(eq(campaigns.id, campaignID))
          .returning();
      },
    );

    const campaign = activatedCampaigns[0];

    if (campaign && campaign.id && campaign.beeswaxSync === 'success') {
      // --------------------------------------------------
      // Write to S3
      // --------------------------------------------------

      await step.invoke('Upload the campaign to S3', {
        function: writeCampaignToS3,
        data: { id: campaign.id },
      });

      // --------------------------------------------------
      // Write to Slack if retargeting campaign
      // --------------------------------------------------

      if (campaign.objective === 'retargeting' && campaign.pixelId) {
        await step.invoke('Write to slack if retargeting campaign', {
          function: writeRetargetingCampaignToSlack,
          data: {
            id: campaignID,
          },
        });
      }

      // --------------------------------------------------
      // Write to Slack for targeting blocks and creatives
      // --------------------------------------------------

      const targetingGroups = await db.query.targetingGroups.findMany({
        where: (targetingGroups, { eq }) => {
          return eq(targetingGroups.campaignId, campaignID);
        },
      });

      for (const targetingGroup of targetingGroups) {
        await step.invoke('Write targeting blocks to Slack', {
          function: writeTargetingGroupToSlack,
          data: {
            id: targetingGroup.id,
            userId: user_id,
          },
        });
      }
    } else {
      // --------------------------------------------------
      // Notify of failure
      // --------------------------------------------------
    }
  },
);

// TODO: make tests for this function
export const campaignDeleted = inngest.createFunction(
  { id: 'campaigns-campaign-deleted' },
  { event: 'campaigns/campaign.deleted' },
  async ({ event, step }) => {
    const campaignID = event.data.id;
    const externalID = event.data.external_id;

    if (!campaignID) throw new NonRetriableError('Campaign ID is missing');
    if (!externalID) throw new NonRetriableError('External ID is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    await step.run(
      'Deactivate campaign & associated targeting groups in beeswax',
      async () => {
        // --------------------------------------------------
        // Targeting Groups
        // --------------------------------------------------

        for (const tg of event.data.targeting_group_ids) {
          // Get UUID from Neon
          const dbResultTG = await db
            .select({
              id: targetingGroups.id,
            })
            .from(targetingGroups)
            .where(eq(targetingGroups.externalId, tg));
          const tgId = dbResultTG[0].id;

          const tgResponse = await fetch(
            `${env.BEESWAX_URL}/rest/v2/line-items/${tg}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Basic ${Buffer.from(
                  env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
                ).toString('base64')}`,
                accept: 'application/json',
                'content-type': 'application/json',
              },
            },
          );

          if (!tgResponse.ok) {
            throw new NonRetriableError(
              `Failed to call beeswax API GET for targeting group ${tg}`,
            );
          }

          const tgResponseData: beeswaxLineItemResponse =
            await tgResponse.json();

          const request = JSON.stringify({
            id: tgResponseData.id,
            campaign_id: tgResponseData.campaign_id,
            name: tgResponseData.name,
            active: false,
            type: 'video',
            notes:
              'Deleted from Skybeam ' +
              now.toLocaleDateString() +
              ' ' +
              now.toTimeString(),
          });

          const response = await fetch(
            `${env.BEESWAX_URL}/rest/v2/line-items/${tgResponseData.id}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Basic ${Buffer.from(
                  env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
                ).toString('base64')}`,
                accept: 'application/json',
                'content-type': 'application/json',
              },
              body: request,
            },
          );

          if (!response.ok) {
            // Insert an audit line item row
            const body = await response.json();
            await db.insert(auditLineitems).values({
              id: tgId,
              requestBody: request,
              responseBody: JSON.stringify(body),
              statusCode: response.status,
              httpMethod: 'PATCH',
              userId: event.data.user_id,
              dsp: 'beeswax',
            });
            // TODO: notify sentry?
            // TODO: notify user with email or pop-up
            throw new NonRetriableError(
              `Failed to call beeswax API PATCH for targeting group ${tgResponseData.name}`,
            );
          }

          // should be 200
          const responseData: beeswaxLineItemResponse = await response.json();

          /**
           * Insert an audit line item row
           */
          await db.insert(auditLineitems).values({
            id: tgId,
            requestBody: request,
            responseBody: JSON.stringify(responseData),
            statusCode: response.status,
            httpMethod: 'PATCH',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
        }

        // --------------------------------------------------
        // Campaign
        // --------------------------------------------------

        // Get advertiser external ID
        const dbResultAdvertiser = await db
          .select({ externalId: advertisers.externalId })
          .from(advertisers)
          .where(eq(advertisers.id, event.data.advertiser_id));
        const advertiserExternalId = dbResultAdvertiser[0].externalId;

        if (!advertiserExternalId) {
          throw new NonRetriableError('Advertiser external ID is missing');
        }

        const request = JSON.stringify({
          name: event.data.name,
          advertiser_id: parseInt(advertiserExternalId),
          active: false,
          notes:
            'Deleted from Skybeam ' +
            now.toLocaleDateString() +
            ' ' +
            now.toTimeString(),
        });

        const response = await fetch(
          `${env.BEESWAX_URL}/rest/v2/campaigns/${externalID}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Basic ${Buffer.from(
                env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
              ).toString('base64')}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: request,
          },
        );

        if (!response.ok) {
          // Insert an audit campaign row
          const body = await response.json();
          await db.insert(auditCampaigns).values({
            id: campaignID,
            requestBody: request,
            responseBody: JSON.stringify(body),
            statusCode: response.status,
            httpMethod: 'PATCH',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
          // TODO: notify sentry?
          // TODO: notify user with email or pop-up
          throw new NonRetriableError(
            `Failed to call beeswax API for campaign ${campaignID}`,
          );
        }

        // should be 200
        const responseData: beeswaxCampaignResponse = await response.json();

        /**
         * Insert an audit campaign row
         */
        await db.insert(auditCampaigns).values({
          id: campaignID,
          requestBody: request,
          responseBody: JSON.stringify(responseData),
          statusCode: response.status,
          httpMethod: 'PATCH',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });
      },
    );
  },
);

/**
 * Calculates lifetime and daily spend for compatability with beeswax API
 */
export function getSpendValues(
  budgetType: (typeof budgetTypeEnum.enumValues)[number],
  budget: number,
  startDate: Date,
  endDate: Date,
): [number, number | null] {
  let lifetimeSpend: number;
  let dailySpend: number | null;
  if (budgetType === 'daily') {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    dailySpend = budget;
    lifetimeSpend = daysDiff * budget;
  } else {
    lifetimeSpend = budget;
    dailySpend = null;
  }
  return [lifetimeSpend, dailySpend];
}

type StringedTimestampsType<T> = {
  [k in keyof T]: T[k] extends Date ? string | undefined : T[k];
};

type TargetingGroupType = StringedTimestampsType<TargetingGroup> & {
  targetingString: string | undefined;
  creatives: StringedTimestampsType<Creative>[];
};

type TranslatedCampaignType = StringedTimestampsType<Campaign> & {
  pixel: StringedTimestampsType<Pixel>;
  advertiser: StringedTimestampsType<Advertiser>;
  targetingGroups: TargetingGroupType[];
};

export function translateTargetingGroupToString(
  targeting: {
    age: string[];
    categories: string[];
    gender: string[];
  },
  targetingOptions: TargetingSegment[],
): string {
  const { age, categories, gender } = targeting;
  return [age, categories, gender]
    .map((categories) => {
      const categoryString = categories
        .map((category) => {
          const targeting = targetingOptions.find(
            (tgo) => tgo.attribute_uuid === category,
          );
          return targeting?.beeswax_segment_id;
        })
        .filter((term) => term)
        .join(' OR ');
      return categoryString ? `(${categoryString})` : '';
    })
    .filter((term) => term)
    .join(' AND ');
}

type VendorType = {
  vendorId: string | null;
  cpm: number;
  vendorName: string | null;
};

export function findHighestVendorFee(
  targeting: {
    age: string[];
    categories: string[];
    gender: string[];
  },
  targetingOptions: TargetingSegment[],
): VendorType {
  const { age, categories, gender } = targeting;

  const segments = [...age, ...categories, ...gender];
  let highestVendor = {
    cpm: 0,
    vendorId: null,
    vendorName: null,
  } as VendorType;
  segments.forEach((segment) => {
    const targeting = targetingOptions.find(
      (tgo) => tgo.attribute_uuid === segment,
    );
    if (targeting?.cpm && targeting.cpm > highestVendor.cpm) {
      highestVendor = {
        cpm: targeting.cpm,
        vendorId: targeting.vendor_id,
        vendorName: targeting.vendor_name,
      };
    }
  });
  return highestVendor;
}

export const translateCampaignToJson = inngest.createFunction(
  { id: 'campaigns-translate-campaign' },
  { event: 'campaigns/translate.campaign' },
  async ({ event, step }) => {
    const { id } = event.data;

    const campaign = await step.run(
      'Find the campaign in the database',
      async () => {
        return await db.query.campaigns.findFirst({
          with: { advertiser: true, pixel: true },
          where: (campaigns, { eq }) => {
            return eq(campaigns.id, id);
          },
        });
      },
    );

    if (campaign?.id) {
      const targetingGroupOptions = await step.run(
        'Get the lookup list of targeting groups',
        async () => {
          const response = await fetchTinyBird(`${basePath}.json`);
          const json = await response.json();
          const targetings: TargetingSegment[] = json.data;
          return targetings;
        },
      );

      const campaignTargetingGroups = await step.run(
        'Find the associated targeting groups',
        async () => {
          return await db.query.targetingGroups.findMany({
            with: {
              targetingGroupCreatives: {
                with: {
                  creative: true,
                },
              },
            },
            where: (targetingGroups, { eq }) => {
              return eq(targetingGroups.campaignId, id);
            },
          });
        },
      );

      const translatedCampaign = await step.run(
        'Translate the found campaign',
        async () => {
          return {
            ...campaign,
            alternativeId: padAltId(campaign.altId, 'skybeam'),
            advertiser: {
              ...campaign.advertiser,
              alternativeId: padAltId(campaign.advertiser.altId, 'skybeam-adv'),
            },
          };
        },
      );

      const translatedTargetingGroups: TargetingGroupType[] = await step.run(
        'Translate the found targeting groups',
        async () => {
          const result = campaignTargetingGroups.map((ctg) => {
            const { targetingGroupCreatives, ...other } = ctg;

            return {
              ...other,
              targetingString: translateTargetingGroupToString(
                ctg,
                targetingGroupOptions,
              ),
              creatives: targetingGroupCreatives.map(({ creative }) => ({
                ...creative,
              })),
            };
          });
          return result;
        },
      );

      const translation = await step.run('Combine the data', async () => ({
        ...translatedCampaign,
        targetingGroups: [...translatedTargetingGroups],
      }));
      return translation as TranslatedCampaignType;
    } else {
      return {} as TranslatedCampaignType;
    }
  },
);

export const createCampaignSlackBlocks = inngest.createFunction(
  { id: 'campaigns-create-slack-blocks' },
  { event: 'campaigns/create.slack.blocks' },
  async ({ event, step }): Promise<AnyBlock[]> => {
    const { id } = event.data;

    const campaign = await step.run(
      'Find the campaign in the database',
      async () => {
        return await db.query.campaigns.findFirst({
          with: {
            advertiser: {
              with: {
                organization: true,
              },
            },
          },
          where: (campaigns, { eq }) => {
            return eq(campaigns.id, id);
          },
        });
      },
    );

    if (!campaign) {
      return [];
    } else {
      const campaignBlocks = await step.run(
        'Create campaign blocks',
        async () => {
          const {
            advertiser,
            advertiser: { organization },
          } = campaign;
          const baseBeeswaxUrl = env.BEESWAX_URL.replace('.api', '');
          return [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Organization*\nOrganization: "${organization?.name}" (ID: ${organization.id})`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Advertiser*\nAdvertiser: <${baseBeeswaxUrl}/advertisers/${advertiser.externalId}/edit|"${advertiser.name}" (ID: ${advertiser.externalId})>`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Campaign*\nCampaign: <${baseBeeswaxUrl}/advertisers/${advertiser.externalId}/campaigns/${campaign.externalId}/edit|"${campaign.name}" (ID: ${campaign.externalId})>`,
              },
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Start Date*\n${campaign.startDate.slice(0, 10)}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*End Date*\n${campaign.endDate.slice(0, 10)}`,
                },
              ],
            },
          ];
        },
      );

      return campaignBlocks;
    }
  },
);

export const writeRetargetingCampaignToSlack = inngest.createFunction(
  { id: 'campaigns-write-retargeting-to-slack' },
  { event: 'campaigns/write.retargeting.to.slack' },
  async ({ event, step }) => {
    const { id } = event.data;

    const campaign = await step.run(
      'Find the campaign in the database',
      async () => {
        return await db.query.campaigns.findFirst({
          with: { advertiser: true, pixel: true },
          where: (campaigns, { eq }) => {
            return eq(campaigns.id, id);
          },
        });
      },
    );

    if (!campaign) {
      return 'Unable to find the campaign';
    } else {
      if (campaign.objective === 'retargeting' && campaign.pixel) {
        const { pixel } = campaign;
        const baseBeeswaxUrl = env.BEESWAX_URL.replace('.api', '');

        const headerBlocks: AnyBlock[] = await step.run(
          'Get header title blocks',
          async () => {
            return [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `:arrow_right_hook: Retargeting Campaign Created (ID: ${campaign.externalId}) :arrow_right_hook:`,
                },
              },
              { type: 'divider' },
            ];
          },
        );

        const campaignBlocks = await step.invoke('Get campaign slack blocks', {
          function: createCampaignSlackBlocks,
          data: {
            id: campaign.id,
          },
        });

        const pixelBlocks: AnyBlock[] = await step.run(
          'Get pixel slack blocks',
          async () => {
            return [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Pixel ${pixel.pixelId} - "${pixel.name}"`,
                },
              },
              { type: 'divider' },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*ID:* \`${pixel.pixelId}\``,
                },
              },
            ];
          },
        );

        const linkBlocks: AnyBlock[] = await step.run(
          'Get the appropriate link slack blocks',
          async () => {
            return [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Links',
                },
              },
              { type: 'divider' },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:white_check_mark: <${baseBeeswaxUrl}/segments/new|Create Segment in Beeswax>`,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:white_check_mark: <https://hub.simulmedia.net/tools/bob-new-configuration/new|Create Extras Retargeting Job>`,
                },
              },
            ];
          },
        );

        await step.invoke('Write targeting group blocks to slack', {
          function: writeToSlack,
          data: {
            blocks: [
              ...headerBlocks,
              ...campaignBlocks,
              ...pixelBlocks,
              ...linkBlocks,
            ],
          },
        });
      } else {
        return 'Campaign is not a retargeting campaign or missing a pixel';
      }
    }
  },
);

export const writeCampaignToS3 = inngest.createFunction(
  { id: 'campaigns-upload-s3' },
  { event: 'campaigns/upload.s3' },
  async ({ event, step }) => {
    const { id } = event.data;

    const translation = await step.invoke('Get the campaign translated', {
      function: translateCampaignToJson,
      data: { id },
    });

    if (translation?.id) {
      await step.run('Upload campaign to S3', async () => {
        const today = new Date();
        const path = `metadata-changes/campaigns/year=${today.getFullYear()}/month=${
          today.getMonth() + 1
        }/day=${today.getDate()}/${id}_${today.toISOString()}.ndjson`;
        return uploadToS3(JSON.stringify(translation), path);
      });
    }
  },
);
