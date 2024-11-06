import { inngest } from '../../client';
import { NonRetriableError } from 'inngest';
import { env } from '../../../env';
import { db } from '../../../server/db';
import { fetchTinyBird } from '../../../server/api/routers/tinybird';
import {
  basePath,
  TargetingSegment,
} from '../../../server/api/routers/tinybird/targeting-segments';
import {
  transformCreativeS3ForPresigned,
  getPresignedUrl,
} from '../../../../src/server/s3';
import {
  advertisers,
  campaigns,
  auditBidmodifiers,
  auditLineitems,
  targetingGroups,
  optionsDeals,
  auditTargetingexpressions,
  environmentEnum,
} from '@limelight/shared-drizzle';
import { format } from 'date-fns';
import { AnyBlock } from '@slack/types';
import { eq } from 'drizzle-orm';
import {
  beeswaxLineItemResponse,
  getBidModifierRequest,
  getTargetingExpressionRequest,
  padAltId,
  targetingExpressionRequest,
} from '@limelight/shared-utils/beeswax/beeswax';
import {
  findHighestVendorFee,
  campaignCreated,
  createCampaignSlackBlocks,
  getSpendValues,
  translateTargetingGroupToString,
  writeCampaignToS3,
} from '../campaigns/campaigns';
import { advertiserCreated } from '../advertisers/advertisers';
import { writeToSlack } from '../slack';

// TODO: make tests for this function
export const targetingGroupCreated = inngest.createFunction(
  { id: 'targeting-groups-targeting-group-created' },
  { event: 'targetingGroups/targetingGroup.created' },
  async ({ event, step }) => {
    const targetingGroupID = event.data.id;
    const targetingGroupName = event.data.name;

    if (!targetingGroupID)
      throw new NonRetriableError('Targeting group ID is missing');
    if (!targetingGroupName)
      throw new NonRetriableError('Targeting group name is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    let environment: (typeof environmentEnum.enumValues)[number] = 'dev';
    if (env.VERCEL_ENV === 'production') {
      environment = 'prod';
    }

    const targetingGroupOptions = await step.run(
      'Get the lookup list of targeting groups',
      async () => {
        const response = await fetchTinyBird(`${basePath}.json`);
        const json = await response.json();
        const targetings: TargetingSegment[] = json.data;
        return targetings;
      },
    );

    const campaignData = await step.run(
      'Check to see if the campaign exists',
      async () => {
        const dbResults = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, event.data.campaign_id));
        return dbResults[0];
      },
    );

    const advertiser = await step.run(
      'Check to see if the advertiser for the campaign exists',
      async () => {
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, campaignData.advertiserId));
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

    await step.run('Create line item in beeswax', async () => {
      // Get campaign external ID, budget type, and start/end dates
      const dbResult = await db
        .select({
          externalId: campaigns.externalId,
          budgetType: campaigns.budgetType,
          startDate: campaigns.startDate,
          endDate: campaigns.endDate,
        })
        .from(campaigns)
        .where(eq(campaigns.id, event.data.campaign_id));
      const campaign = dbResult[0];

      if (!campaign.externalId)
        throw new NonRetriableError('Campaign external ID is missing');

      // TODO: this should be updated if we accept lifetime budget for targeting groups
      const [lifetimeSpend, dailySpend] = getSpendValues(
        'daily',
        event.data.budget,
        campaign.startDate,
        campaign.endDate,
      );

      // Update beeswax sync status to 'pending'
      await db
        .update(targetingGroups)
        .set({
          beeswaxSync: 'pending',
        })
        .where(eq(targetingGroups.id, targetingGroupID));

      // --------------------------------------------------
      // Targeting expression
      // --------------------------------------------------

      // Get deal IDs
      const dbResultDeals = await db
        .select({
          beeswaxId: optionsDeals.beeswaxId,
          multiplier: optionsDeals.multiplier,
        })
        .from(optionsDeals)
        .where(eq(optionsDeals.environment, environment));

      const deals: { id: string; multiplier: number }[] = [];
      const dealIDs: string[] = [];
      dbResultDeals.forEach((result) => {
        dealIDs.push(result.beeswaxId);
        deals.push({ id: result.beeswaxId, multiplier: result.multiplier });
      });

      // Get segments string
      const segments = translateTargetingGroupToString(
        {
          age: event.data.age,
          categories: event.data.categories,
          gender: event.data.gender,
        },
        targetingGroupOptions,
      );

      const requestTargetingExpression = getTargetingExpressionRequest(
        parseInt(`${env.BEESWAX_ACCOUNT_ID}`),
        padAltId(event.data.alt_id, 'skybeam-tg'),
        targetingGroupName,
        event.data.inventories,
        dealIDs,
        event.data.geo_targeting,
        segments,
      );

      const responseTargetingExpression = await fetch(
        `${env.BEESWAX_URL}/rest/v2/targeting-expressions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
            ).toString('base64')}`,
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify(requestTargetingExpression),
        },
      );

      if (!responseTargetingExpression.ok) {
        // Update beeswax sync status to 'failure'
        await db
          .update(targetingGroups)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(targetingGroups.id, targetingGroupID));
        // Insert an audit targeting expression row
        const body = await responseTargetingExpression.json();
        await db.insert(auditTargetingexpressions).values({
          id: targetingGroupID,
          requestBody: requestTargetingExpression,
          responseBody: JSON.stringify(body),
          statusCode: responseTargetingExpression.status,
          httpMethod: 'POST',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });
        // TODO: notify sentry?
        // TODO: notify user with email or pop-up
        throw new NonRetriableError(
          `Failed to call beeswax API for targeting group ${targetingGroupName} targeting expression`,
        );
      }

      const targetingExpressionData = await responseTargetingExpression.json();

      /**
       * Insert an audit targeting expression row
       */
      await db.insert(auditTargetingexpressions).values({
        id: targetingGroupID,
        requestBody: requestTargetingExpression,
        responseBody: JSON.stringify(targetingExpressionData),
        statusCode: responseTargetingExpression.status,
        httpMethod: 'POST',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // --------------------------------------------------
      // Bid modifier
      // --------------------------------------------------

      const requestBidModifier = getBidModifierRequest(
        parseInt(`${env.BEESWAX_ACCOUNT_ID}`),
        padAltId(event.data.alt_id, 'skybeam-tg'),
        targetingGroupName,
        deals,
        'Updated from Skybeam ' +
          now.toLocaleDateString() +
          ' ' +
          now.toTimeString(),
      );

      const responseBidModifier = await fetch(
        `${env.BEESWAX_URL}/rest/v2/bid-modifiers`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
            ).toString('base64')}`,
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify(requestBidModifier),
        },
      );

      if (!responseBidModifier.ok) {
        // Update beeswax sync status to 'failure'
        await db
          .update(targetingGroups)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(targetingGroups.id, targetingGroupID));
        // Insert an audit bid modifier row
        const body = await responseBidModifier.json();
        await db.insert(auditBidmodifiers).values({
          id: targetingGroupID,
          requestBody: requestBidModifier,
          responseBody: JSON.stringify(body),
          statusCode: responseBidModifier.status,
          httpMethod: 'POST',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });
        // TODO: notify sentry?
        // TODO: notify user with email or pop-up
        throw new NonRetriableError(
          `Failed to call beeswax API for targeting group ${targetingGroupName} bid modifier`,
        );
      }

      const bidModifierData = await responseBidModifier.json();

      /**
       * Insert an audit bid modifier row
       */
      await db.insert(auditBidmodifiers).values({
        id: targetingGroupID,
        requestBody: requestBidModifier,
        responseBody: JSON.stringify(bidModifierData),
        statusCode: responseBidModifier.status,
        httpMethod: 'POST',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // --------------------------------------------------
      // Line item
      // --------------------------------------------------

      // Get vendor fee
      const vendorFee = findHighestVendorFee(
        {
          age: event.data.age,
          categories: event.data.categories,
          gender: event.data.gender,
        },
        targetingGroupOptions,
      );

      const request = JSON.stringify({
        campaign_id: campaign.externalId,
        name: targetingGroupName,
        type: 'video',
        bid_modifier_id: bidModifierData.id,
        targeting_expression_id: targetingExpressionData.id,
        start_date: campaign.startDate
          ? format(
              campaign.startDate.toLocaleString('en-US', {
                timeZone: 'America/New_York',
              }),
              'yyyy-MM-dd HH:mm:ss',
            )
          : null,
        end_date: campaign.endDate
          ? format(
              campaign.endDate.toLocaleString('en-US', {
                timeZone: 'America/New_York',
              }),
              'yyyy-MM-dd HH:mm:ss',
            )
          : null,
        currency: 'USD',
        guaranteed: false,
        budget_type: 'spend including vendor fees',
        spend_budget: {
          lifetime: lifetimeSpend,
          daily: dailySpend,
        },
        max_bid: '50',
        bidding: {
          strategy: 'CPM_PACED',
          values: {
            cpm_bid: 10,
          },
          pacing: campaign.budgetType,
          pacing_behavior: 'even',
          multiplier: '1',
          catchup_behavior: 'even',
          bid_shading_control: null,
        },
        vendor_fees: [
          {
            name: vendorFee.vendorName,
            vendor: vendorFee.vendorName,
            vendor_id: vendorFee.vendorId,
          },
        ],
        alternative_id: padAltId(event.data.alt_id, 'skybeam-tg'),
        notes:
          'Updated from Skybeam ' +
          now.toLocaleDateString() +
          ' ' +
          now.toTimeString(),
      });

      const response = await fetch(`${env.BEESWAX_URL}/rest/v2/line-items`, {
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
          .update(targetingGroups)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(targetingGroups.id, targetingGroupID));
        // Insert an audit line item row
        const body = await response.json();
        await db.insert(auditLineitems).values({
          id: targetingGroupID,
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
          `Failed to call beeswax API for targeting group ${targetingGroupName}`,
        );
      }

      // should be 201
      const responseData: beeswaxLineItemResponse = await response.json();

      /**
       * Insert an audit line item row
       */
      await db.insert(auditLineitems).values({
        id: targetingGroupID,
        requestBody: request,
        responseBody: JSON.stringify(responseData),
        statusCode: response.status,
        httpMethod: 'POST',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // Update targeting group external ID with beeswax ID & set beeswax sync status to 'success'
      return db
        .update(targetingGroups)
        .set({
          beeswaxSync: 'success',
          externalId: String(responseData.id),
          targetingExpressionId: targetingExpressionData.id,
          bidModifierId: bidModifierData.id,
        })
        .where(eq(targetingGroups.id, targetingGroupID))
        .returning({
          id: targetingGroups.id,
          beeswaxSync: targetingGroups.beeswaxSync,
          campaignId: targetingGroups.campaignId,
        });
    });
  },
);

// TODO: make tests for this function
export const targetingGroupUpdated = inngest.createFunction(
  { id: 'targeting-groups-targeting-group-updated' },
  { event: 'targetingGroups/targetingGroup.updated' },
  async ({ event, step }) => {
    const targetingGroupID = event.data.id;
    const targetingGroupName = event.data.name;

    if (!targetingGroupID)
      throw new NonRetriableError('Targeting group ID is missing');
    if (!targetingGroupName)
      throw new NonRetriableError('Targeting group name is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    let environment: (typeof environmentEnum.enumValues)[number] = 'dev';
    if (env.VERCEL_ENV === 'production') {
      environment = 'prod';
    }

    const targetingGroupOptions = await step.run(
      'Get the lookup list of targeting groups',
      async () => {
        const response = await fetchTinyBird(`${basePath}.json`);
        const json = await response.json();
        const targetings: TargetingSegment[] = json.data;
        return targetings;
      },
    );

    const campaignData = await step.run(
      'Check to see if the campaign exists',
      async () => {
        const dbResults = await db
          .select()
          .from(campaigns)
          .where(eq(campaigns.id, event.data.campaign_id));
        return dbResults[0];
      },
    );

    const advertiser = await step.run(
      'Check to see if the advertiser for the campaign exists',
      async () => {
        const dbResultAdvertiser = await db
          .select()
          .from(advertisers)
          .where(eq(advertisers.id, campaignData.advertiserId));
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

    const externalId = await step.run(
      'Check dependencies for a targeting group',
      async () => {
        const dbResult = await db
          .select({
            externalId: targetingGroups.externalId,
            targetingExpressionId: targetingGroups.targetingExpressionId,
            bidModifierId: targetingGroups.bidModifierId,
          })
          .from(targetingGroups)
          .where(eq(targetingGroups.id, targetingGroupID));
        return dbResult[0]?.externalId;
      },
    );

    if (!externalId) {
      await step.invoke('Create the line item', {
        function: targetingGroupCreated,
        data: event.data,
      });
    }

    const updatedLineItems = await step.run(
      'Update line item in beeswax',
      async () => {
        // TODO: UI should not allow updates if status is 'pending' (or 'failure'?)

        const dbResult = await db
          .select({
            externalId: targetingGroups.externalId,
            targetingExpressionId: targetingGroups.targetingExpressionId,
            bidModifierId: targetingGroups.bidModifierId,
          })
          .from(targetingGroups)
          .where(eq(targetingGroups.id, targetingGroupID));
        const externalId = dbResult[0].externalId;
        const targetingExpressionId = dbResult[0].targetingExpressionId;
        const bidModifierId = dbResult[0].bidModifierId;

        if (!externalId) throw new NonRetriableError('External ID is missing');
        if (!targetingExpressionId)
          throw new NonRetriableError('Targeting expression ID is missing');

        // Get campaign external ID, budget type, objective, and start/end dates
        const dbResultCampaign = await db
          .select({
            externalId: campaigns.externalId,
            budgetType: campaigns.budgetType,
            objective: campaigns.objective,
            startDate: campaigns.startDate,
            endDate: campaigns.endDate,
          })
          .from(campaigns)
          .where(eq(campaigns.id, event.data.campaign_id));
        const campaign = dbResultCampaign[0];

        if (!campaign.externalId)
          throw new NonRetriableError('Campaign external ID is missing');

        // TODO: this should be updated if we accept lifetime budget for targeting groups
        const [lifetimeSpend, dailySpend] = getSpendValues(
          'daily',
          event.data.budget,
          campaign.startDate,
          campaign.endDate,
        );

        // Update beeswax sync status to 'pending'
        await db
          .update(targetingGroups)
          .set({
            beeswaxSync: 'pending',
          })
          .where(eq(targetingGroups.id, targetingGroupID));

        // --------------------------------------------------
        // Targeting expression
        // --------------------------------------------------

        // Get deal IDs
        const dbResultDeals = await db
          .select({
            beeswaxId: optionsDeals.beeswaxId,
            multiplier: optionsDeals.multiplier,
          })
          .from(optionsDeals)
          .where(eq(optionsDeals.environment, environment));

        const deals: { id: string; multiplier: number }[] = [];
        const dealIDs: string[] = [];
        dbResultDeals.forEach((result) => {
          dealIDs.push(result.beeswaxId);
          deals.push({ id: result.beeswaxId, multiplier: result.multiplier });
        });

        let requestTargetingExpression: targetingExpressionRequest;

        // We do NOT want to overwrite segments for retargeting campaigns
        // However, beeswax does not have partial update capability for targeting expressions
        if (campaign.objective === 'retargeting') {
          // Get current targeting expression
          const getTargetingExpression = await fetch(
            `${env.BEESWAX_URL}/rest/v2/targeting-expressions/${targetingExpressionId}`,
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

          if (!getTargetingExpression.ok) {
            // Update beeswax sync status to 'failure'
            await db
              .update(targetingGroups)
              .set({
                beeswaxSync: 'failure',
              })
              .where(eq(targetingGroups.id, targetingGroupID));
            // Insert an audit targeting expression row
            const body = await getTargetingExpression.json();
            await db.insert(auditTargetingexpressions).values({
              id: targetingGroupID,
              requestBody: getTargetingExpression,
              responseBody: JSON.stringify(body),
              statusCode: getTargetingExpression.status,
              httpMethod: 'GET',
              userId: event.data.user_id,
              dsp: 'beeswax',
            });
            // TODO: notify sentry?
            // TODO: notify user with email or pop-up
            throw new NonRetriableError(
              `Failed to call beeswax API for targeting group ${targetingGroupName} targeting expression`,
            );
          }

          const targetingExpressionData: targetingExpressionRequest =
            await getTargetingExpression.json();

          /**
           * Insert an audit targeting expression row
           */
          await db.insert(auditTargetingexpressions).values({
            id: targetingGroupID,
            requestBody: getTargetingExpression,
            responseBody: JSON.stringify(targetingExpressionData),
            statusCode: getTargetingExpression.status,
            httpMethod: 'GET',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });

          // Update targeting expression using existing segments
          requestTargetingExpression = getTargetingExpressionRequest(
            parseInt(`${env.BEESWAX_ACCOUNT_ID}`),
            padAltId(event.data.alt_id, 'skybeam-tg'),
            targetingGroupName,
            event.data.inventories,
            dealIDs,
            event.data.geo_targeting,
            '',
          );

          requestTargetingExpression.modules.user =
            targetingExpressionData.modules.user;
        } else {
          // Get segments string
          const segments = translateTargetingGroupToString(
            {
              age: event.data.age,
              categories: event.data.categories,
              gender: event.data.gender,
            },
            targetingGroupOptions,
          );

          requestTargetingExpression = getTargetingExpressionRequest(
            parseInt(`${env.BEESWAX_ACCOUNT_ID}`),
            padAltId(event.data.alt_id, 'skybeam-tg'),
            targetingGroupName,
            event.data.inventories,
            dealIDs,
            event.data.geo_targeting,
            segments,
          );
        }

        const responseTargetingExpression = await fetch(
          `${env.BEESWAX_URL}/rest/v2/targeting-expressions/${targetingExpressionId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Basic ${Buffer.from(
                env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
              ).toString('base64')}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: JSON.stringify(requestTargetingExpression),
          },
        );

        if (!responseTargetingExpression.ok) {
          // Update beeswax sync status to 'failure'
          await db
            .update(targetingGroups)
            .set({
              beeswaxSync: 'failure',
            })
            .where(eq(targetingGroups.id, targetingGroupID));
          // Insert an audit line item row
          const body = await responseTargetingExpression.json();
          await db.insert(auditLineitems).values({
            id: targetingGroupID,
            requestBody: requestTargetingExpression,
            responseBody: JSON.stringify(body),
            statusCode: responseTargetingExpression.status,
            httpMethod: 'PUT',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
          // TODO: notify sentry?
          // TODO: notify user with email or pop-up
          throw new NonRetriableError(
            `Failed to call beeswax API for targeting group ${targetingGroupName} targeting expression`,
          );
        }

        const targetingExpressionData =
          await responseTargetingExpression.json();

        /**
         * Insert an audit targeting expression row
         */
        await db.insert(auditTargetingexpressions).values({
          id: targetingGroupID,
          requestBody: requestTargetingExpression,
          responseBody: JSON.stringify(targetingExpressionData),
          statusCode: responseTargetingExpression.status,
          httpMethod: 'PUT',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });

        // --------------------------------------------------
        // Bid modifier
        // --------------------------------------------------

        const requestBidModifier = getBidModifierRequest(
          parseInt(`${env.BEESWAX_ACCOUNT_ID}`),
          padAltId(event.data.alt_id, 'skybeam-tg'),
          targetingGroupName,
          deals,
          'Updated from Skybeam ' +
            now.toLocaleDateString() +
            ' ' +
            now.toTimeString(),
        );

        const responseBidModifier = await fetch(
          `${env.BEESWAX_URL}/rest/v2/bid-modifiers/${bidModifierId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Basic ${Buffer.from(
                env.BEESWAX_EMAIL + ':' + env.BEESWAX_PASS,
              ).toString('base64')}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: JSON.stringify(requestBidModifier),
          },
        );

        if (!responseBidModifier.ok) {
          // Update beeswax sync status to 'failure'
          await db
            .update(targetingGroups)
            .set({
              beeswaxSync: 'failure',
            })
            .where(eq(targetingGroups.id, targetingGroupID));
          // Insert an audit bid modifier row
          const body = await responseBidModifier.json();
          await db.insert(auditBidmodifiers).values({
            id: targetingGroupID,
            requestBody: requestBidModifier,
            responseBody: JSON.stringify(body),
            statusCode: responseBidModifier.status,
            httpMethod: 'PUT',
            userId: event.data.user_id,
            dsp: 'beeswax',
          });
          // TODO: notify sentry?
          // TODO: notify user with email or pop-up
          throw new NonRetriableError(
            `Failed to call beeswax API for targeting group ${targetingGroupName} bid modifier`,
          );
        }

        const bidModifierData = await responseBidModifier.json();

        /**
         * Insert an audit bid modifier row
         */
        await db.insert(auditBidmodifiers).values({
          id: targetingGroupID,
          requestBody: requestBidModifier,
          responseBody: JSON.stringify(bidModifierData),
          statusCode: responseBidModifier.status,
          httpMethod: 'PUT',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });

        // --------------------------------------------------
        // Line item
        // --------------------------------------------------

        // Get vendor fee
        const vendorFee = findHighestVendorFee(
          {
            age: event.data.age,
            categories: event.data.categories,
            gender: event.data.gender,
          },
          targetingGroupOptions,
        );

        const request = JSON.stringify({
          campaign_id: campaign.externalId,
          name: targetingGroupName,
          type: 'video',
          bid_modifier_id: bidModifierId,
          targeting_expression_id: targetingExpressionId,
          start_date: campaign.startDate
            ? format(
                campaign.startDate.toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                }),
                'yyyy-MM-dd HH:mm:ss',
              )
            : null,
          end_date: campaign.endDate
            ? format(
                campaign.endDate.toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                }),
                'yyyy-MM-dd HH:mm:ss',
              )
            : null,
          currency: 'USD',
          guaranteed: false,
          budget_type: 'spend including vendor fees',
          spend_budget: {
            lifetime: lifetimeSpend,
            daily: dailySpend,
          },
          max_bid: '50',
          bidding: {
            strategy: 'CPM_PACED',
            values: {
              cpm_bid: 10,
            },
            pacing: campaign.budgetType,
            pacing_behavior: 'even',
            multiplier: '1',
            catchup_behavior: 'even',
            bid_shading_control: null,
          },
          vendor_fees: [
            {
              name: vendorFee.vendorName,
              vendor: vendorFee.vendorName,
              vendor_id: vendorFee.vendorId,
            },
          ],
          alternative_id: padAltId(event.data.alt_id, 'skybeam-tg'),
          notes:
            'Updated from Skybeam ' +
            now.toLocaleDateString() +
            ' ' +
            now.toTimeString(),
        });

        const response = await fetch(
          `${env.BEESWAX_URL}/rest/v2/line-items/${externalId}`,
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
            .update(targetingGroups)
            .set({
              beeswaxSync: 'failure',
            })
            .where(eq(targetingGroups.id, targetingGroupID));
          // Insert an audit line item row
          const body = await response.json();
          await db.insert(auditLineitems).values({
            id: targetingGroupID,
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
            `Failed to call beeswax API for targeting group ${targetingGroupName}`,
          );
        }

        // should be 200
        const responseData: beeswaxLineItemResponse = await response.json();

        /**
         * Insert an audit line item row
         */
        await db.insert(auditLineitems).values({
          id: targetingGroupID,
          requestBody: request,
          responseBody: JSON.stringify(responseData),
          statusCode: response.status,
          httpMethod: 'PUT',
          userId: event.data.user_id,
          dsp: 'beeswax',
        });

        // Update beeswax sync status to 'success'
        return db
          .update(targetingGroups)
          .set({
            beeswaxSync: 'success',
          })
          .where(eq(targetingGroups.id, targetingGroupID))
          .returning({
            id: targetingGroups.id,
            beeswaxSync: targetingGroups.beeswaxSync,
            campaignId: targetingGroups.campaignId,
          });
      },
    );

    if (
      updatedLineItems[0] &&
      updatedLineItems[0].id &&
      updatedLineItems[0].beeswaxSync === 'success'
    ) {
      await step.invoke('Upload the campaign to S3', {
        function: writeCampaignToS3,
        data: { id: updatedLineItems[0].campaignId },
      });
    }
  },
);

export const writeTargetingGroupToSlack = inngest.createFunction(
  {
    id: 'targeting-groups-write-to-slack',
  },
  { event: 'targetingGroups/write.to.slack' },
  async ({ step, event }) => {
    await step.sleep('Wait until transcoding finishes', '10s');
    const { id, userId } = event.data;

    const targetingGroup = await step.run(
      'Find the targeting group in the database',
      async () => {
        return await db.query.targetingGroups.findFirst({
          with: {
            targetingGroupCreatives: {
              with: {
                creative: true,
              },
            },
            campaign: {
              with: {
                advertiser: {
                  with: {
                    organization: true,
                  },
                },
              },
            },
          },
          where: (targetingGroups, { eq }) => {
            return eq(targetingGroups.id, id);
          },
        });
      },
    );

    if (!targetingGroup?.id) {
      throw new NonRetriableError(
        'Could not find a targeting group in the database',
      );
    } else {
      const {
        campaign,
        campaign: { advertiser },
        targetingGroupCreatives,
      } = targetingGroup;
      const baseBeeswaxUrl = env.BEESWAX_URL.replace('.api', '');

      const headerBlocks: AnyBlock[] = await step.run(
        'Get header title slack blocks',
        async () => {
          return [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `:dart: Targeting Group Updated (ID: ${targetingGroup.externalId}) :dart:`,
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

      const targetingGroupBlocks: AnyBlock[] = await step.run(
        'Get targeting group slack blocks',
        async () => {
          const hasHulu = targetingGroup.inventories.includes(
            env.HULU_INVENTORY_ID,
          )
            ? 'Yes :white_check_mark:'
            : 'No :no_entry_sign:';
          return [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Targeting Group*\nTargeting Group: <${baseBeeswaxUrl}/advertisers/${advertiser.externalId}/campaigns/${campaign.externalId}/line_items/${targetingGroup.externalId}/edit|"${targetingGroup.name}" (ID: ${targetingGroup.externalId})>`,
              },
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Budget*\n$${targetingGroup.budget}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Has Hulu*\n${hasHulu}`,
                },
              ],
            },
          ];
        },
      );

      const creativeBlocks: AnyBlock[] = await step.run(
        'Get the creatives associated with the targeting group slack blocks',
        async () => {
          let blocks: AnyBlock[] = [];
          let idx = -1;

          for (const targetingGroupCreative of targetingGroupCreatives) {
            idx += 1;
            const { creative } = targetingGroupCreative;
            const videoPath = transformCreativeS3ForPresigned(
              creative.transcodedPath as string,
              'mp4/creative_MP4.mp4',
            );
            const previewUrl = await getPresignedUrl(videoPath, 604800);

            const creativeDuration = creative.durationMS
              ? `${creative.durationMS / 1000} seconds`
              : 'N/A';
            blocks = blocks.concat([
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Creative (${idx + 1}/${
                    targetingGroupCreatives.length
                  }) - "${creative.name}"`,
                },
              },
              { type: 'divider' },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: [
                    `<${previewUrl}|:movie_camera: See Creative>`,
                    `S3 Path: \`${
                      creative.transcodedPath + `mp4/creative_MP4.mp4`
                    }\``,
                  ].join('\n'),
                },
                accessory: {
                  type: 'image',
                  image_url: creative.previewUrl,
                  alt_text: `"${creative.name}" Preview`,
                },
              },
              {
                type: 'section',
                block_id: `creative_information_${creative.id}`,
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Duration*\n${creativeDuration}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Resolution*\n${creative.resolutionWidth}x${creative.resolutionHeight}`,
                  },
                ],
              },
            ] as AnyBlock[]);
          }

          return blocks;
        },
      );

      const userBlocks: AnyBlock[] = await step.run(
        'Get the user who updated the targeting group slack blocks',
        async () => {
          if (userId) {
            const user = await db.query.users.findFirst({
              where: (users, { eq }) => {
                return eq(users.id, userId);
              },
            });

            if (!user) {
              return [];
            } else {
              const imageBlock = user.hasImage
                ? {
                    accessory: {
                      type: 'image',
                      image_url: user.imageUrl,
                      alt_text: user.id,
                    },
                  }
                : {};
              return [
                {
                  type: 'section',
                  text: {
                    type: 'plain_text',
                    text: 'User Information',
                  },
                },
                { type: 'divider' },
                {
                  type: 'section',
                  block_id: `user_information${user.id}}`,
                  fields: [
                    {
                      type: 'mrkdwn',
                      text: `*First Name*\n${user.firstName}`,
                    },
                    {
                      type: 'mrkdwn',
                      text: `*Last Name*\n${user.lastName}`,
                    },
                  ],
                  ...imageBlock,
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Email Addresses*:\n${user.emailAddresses
                      ?.map((e) => e.email_address)
                      ?.join('\n')}`,
                  },
                },
              ];
            }
          } else {
            return [];
          }
        },
      );

      await step.invoke('Write targeting group blocks to slack', {
        function: writeToSlack,
        data: {
          blocks: [
            ...headerBlocks,
            ...campaignBlocks,
            ...targetingGroupBlocks,
            ...creativeBlocks,
            ...userBlocks,
          ],
        },
      });
    }
  },
);
