import { inngest } from '../../client';
import { NonRetriableError } from 'inngest';
import { env } from '../../../env';
import { db } from '../../../server/db';
import { advertisers, auditAdvertisers } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import {
  beeswaxAdvertiserResponse,
  iabCategoryMap,
  padAltId,
} from '@limelight/shared-utils/beeswax/beeswax';

// TODO: make tests for this function
export const advertiserCreated = inngest.createFunction(
  { id: 'advertisers-advertiser-created' },
  { event: 'advertisers/advertiser.created' },
  async ({ event, step }) => {
    const advertiserID = event.data.id;
    const advertiserName = event.data.name;

    if (!advertiserID) throw new NonRetriableError('Advertiser ID is missing');
    if (!advertiserName)
      throw new NonRetriableError('Advertiser name is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    await step.run('Create advertiser in beeswax', async () => {
      // Update beeswax sync status to 'pending'
      await db
        .update(advertisers)
        .set({
          beeswaxSync: 'pending',
        })
        .where(eq(advertisers.id, advertiserID));

      const request = JSON.stringify({
        name: advertiserName,
        active: true,
        domain: event.data.website,
        category: iabCategoryMap.get(event.data.industry),
        default_continent: 'NAM',
        default_currency: 'USD',
        alternative_id: padAltId(event.data.alt_id, 'skybeam-adv'),
        notes: 'Updated from Skybeam ' + now.toTimeString(),
      });

      const response = await fetch(`${env.BEESWAX_URL}/rest/v2/advertisers`, {
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
          .update(advertisers)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(advertisers.id, advertiserID));
        // Insert an audit advertiser row
        const body = await response.json();
        await db.insert(auditAdvertisers).values({
          id: advertiserID,
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
          `Failed to call beeswax API for advertiser ${advertiserName}`,
        );
      }

      // should be 201
      const responseData: beeswaxAdvertiserResponse = await response.json();

      /**
       * Insert an audit advertiser row
       */
      await db.insert(auditAdvertisers).values({
        id: advertiserID,
        requestBody: request,
        responseBody: JSON.stringify(responseData),
        statusCode: response.status,
        httpMethod: 'POST',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // Update advertiser external ID with beeswax ID & set beeswax sync status to 'success'
      return db
        .update(advertisers)
        .set({
          beeswaxSync: 'success',
          externalId: String(responseData.id),
        })
        .where(eq(advertisers.id, advertiserID));
    });
  },
);

// TODO: make tests for this function
export const advertiserUpdated = inngest.createFunction(
  { id: 'advertisers-advertiser-updated' },
  { event: 'advertisers/advertiser.updated' },
  async ({ event, step }) => {
    const advertiserID = event.data.id;
    const advertiserName = event.data.name;

    if (!advertiserID) throw new NonRetriableError('Advertiser ID is missing');
    if (!advertiserName)
      throw new NonRetriableError('Advertiser name is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    const advertiserExternalId = await step.run(
      'Check to see if the advertiser exists',
      async () => {
        const dbResult = await db
          .select({ externalId: advertisers.externalId })
          .from(advertisers)
          .where(eq(advertisers.id, advertiserID));
        return dbResult[0]?.externalId;
      },
    );

    if (!advertiserExternalId) {
      await step.invoke('Create the advertiser', {
        function: advertiserCreated,
        data: event.data,
      });
    }

    await step.run('Update advertiser in beeswax', async () => {
      // TODO: UI should not allow updates if status is 'pending' (or 'failure'?)

      const dbResult = await db
        .select({ externalId: advertisers.externalId })
        .from(advertisers)
        .where(eq(advertisers.id, advertiserID));
      const externalId = dbResult[0].externalId;

      if (!externalId) throw new NonRetriableError('External ID is missing');

      // Update beeswax sync status to 'pending'
      await db
        .update(advertisers)
        .set({
          beeswaxSync: 'pending',
        })
        .where(eq(advertisers.id, advertiserID));

      const request = JSON.stringify({
        name: advertiserName,
        active: true,
        domain: event.data.website,
        category: iabCategoryMap.get(event.data.industry),
        default_continent: 'NAM',
        default_currency: 'USD',
        alternative_id: padAltId(event.data.alt_id, 'skybeam-adv'),
        notes: 'Updated from Skybeam ' + now.toTimeString(),
      });

      const response = await fetch(
        `${env.BEESWAX_URL}/rest/v2/advertisers/${externalId}`,
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
          .update(advertisers)
          .set({
            beeswaxSync: 'failure',
          })
          .where(eq(advertisers.id, advertiserID));
        // Insert an audit advertiser row
        const body = await response.json();
        await db.insert(auditAdvertisers).values({
          id: advertiserID,
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
          `Failed to call beeswax API for advertiser ${advertiserName}`,
        );
      }

      // should be 200
      const responseData: beeswaxAdvertiserResponse = await response.json();

      /**
       * Insert an audit advertiser row
       */
      await db.insert(auditAdvertisers).values({
        id: advertiserID,
        requestBody: request,
        responseBody: JSON.stringify(responseData),
        statusCode: response.status,
        httpMethod: 'PUT',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });

      // Update beeswax sync status to 'success'
      return db
        .update(advertisers)
        .set({
          beeswaxSync: 'success',
        })
        .where(eq(advertisers.id, advertiserID));
    });
  },
);

// TODO: make tests for this function
export const advertiserDeleted = inngest.createFunction(
  { id: 'advertisers-advertiser-deleted' },
  { event: 'advertisers/advertiser.deleted' },
  async ({ event, step }) => {
    const advertiserID = event.data.id;
    const externalID = event.data.external_id;

    if (!advertiserID) throw new NonRetriableError('Advertiser ID is missing');
    if (!externalID) throw new NonRetriableError('External ID is missing');

    const now = new Date();

    // --------------------------------------------------
    // Beeswax Activation
    // --------------------------------------------------

    await step.run('Deactivate advertiser in beeswax', async () => {
      const request = JSON.stringify({
        name: event.data.name,
        active: false,
        domain: event.data.website,
        category: iabCategoryMap.get(event.data.industry),
        notes: 'Deleted from Skybeam ' + now.toTimeString(),
      });

      const response = await fetch(
        `${env.BEESWAX_URL}/rest/v2/advertisers/${externalID}`,
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
        // Insert an audit advertiser row
        const body = await response.json();
        await db.insert(auditAdvertisers).values({
          id: advertiserID,
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
          `Failed to call beeswax API for advertiser ${advertiserID}`,
        );
      }

      // should be 200
      const responseData: beeswaxAdvertiserResponse = await response.json();

      /**
       * Insert an audit advertiser row
       */
      await db.insert(auditAdvertisers).values({
        id: advertiserID,
        requestBody: request,
        responseBody: JSON.stringify(responseData),
        statusCode: response.status,
        httpMethod: 'PATCH',
        userId: event.data.user_id,
        dsp: 'beeswax',
      });
    });
  },
);
