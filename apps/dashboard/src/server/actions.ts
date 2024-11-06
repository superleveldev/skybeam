'use server';

// import { auth } from '@clerk/nextjs/server';
import { api } from '../trpc/server';
import {
  Campaign,
  FormAdvertiser,
  FormCampaign,
  FormTargetingGroup,
  InsertAdvertiserSchema,
  InsertCampaignSchema,
  TargetingGroupCreative,
} from '@limelight/shared-drizzle';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { inngest } from '../inngest/client';
import { revalidatePath } from 'next/cache';
import { CampaignFields } from '../app/(private)/campaigns/types';
import { TRPCClientError } from '@trpc/client';
import { NeonDbError } from '@neondatabase/serverless';
import { currentUser } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';

/**
 * This file contains "server actions", to be called via React components.
 *
 * They might make use of tRPC procedures (to make use of auth middleware, etc.)
 * as well as "queries" from the queries.ts file (repeated business logic for DB interactions)
 */

// --------------------------------------------------
// Campaigns
// --------------------------------------------------

/**
 * Save a draft of a campaign if a user selects 'save draft' instead of 'save and continue'
 */
export async function saveDraftCampaign(payload: FormCampaign | Campaign) {
  const mutation = payload.id
    ? api.campaigns.updateCampaign
    : api.campaigns.insertCampaign;

  let result: Awaited<ReturnType<typeof mutation.mutate>>[number];

  try {
    [result] = await mutation.mutate(
      payload as Parameters<typeof mutation.mutate>[0],
    );

    if (!result || !result.id) {
      throw new Error(
        'Something went wrong; please try again or contact support',
      );
    }

    const campaign = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we updated a draft campaign
     */
    if (payload.id) {
      await inngest.send({
        name: 'campaigns/campaign.updated',
        data: {
          id: campaign.id,
          name: campaign.name,
          budget: campaign.budget,
          budget_type: campaign.budgetType,
          advertiser_id: campaign.advertiserId,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          alt_id: campaign.altId,
          user_id: userId,
          frequency: campaign.frequency,
          frequency_period: campaign.frequencyPeriod,
        },
      });
    } else {
      await inngest.send({
        name: 'campaigns/campaign.created',
        data: {
          id: campaign.id,
          name: campaign.name,
          budget: campaign.budget,
          budget_type: campaign.budgetType,
          advertiser_id: campaign.advertiserId,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          alt_id: campaign.altId,
          user_id: userId,
          frequency: campaign.frequency,
          frequency_period: campaign.frequencyPeriod,
        },
      });
    }
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'campaign_name'
    ) {
      return {
        field: 'name' as CampaignFields,
        message: 'Campaign name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/campaigns');
  redirect(`/campaigns`);
}

/**
 * Create a new campaign if a user selects 'save and continue'
 * NB: This is not equivalent to "publishing" a campaign, which is a separate action
 */
export async function createCampaign(
  payload: z.infer<typeof InsertCampaignSchema>,
) {
  let result: Awaited<
    ReturnType<typeof api.campaigns.insertCampaign.mutate>
  >[number];

  try {
    [result] = await api.campaigns.insertCampaign.mutate(payload);

    if (!result || !result.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const campaign = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we created a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.created',
      data: {
        id: campaign.id,
        name: campaign.name,
        budget: campaign.budget,
        budget_type: campaign.budgetType,
        advertiser_id: campaign.advertiserId,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        alt_id: campaign.altId,
        user_id: userId,
        frequency: campaign.frequency,
        frequency_period: campaign.frequencyPeriod,
      },
    });
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'campaign_name'
    ) {
      return {
        field: 'name' as CampaignFields,
        message: 'Campaign name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }
  redirect(`/campaigns/${result.id}/targeting-groups/new`);
}

/**
 * Update an existing campaign if a user selects 'save and continue'
 */
export async function updateCampaign(payload: FormCampaign & { id: string }) {
  let result: Awaited<
    ReturnType<typeof api.campaigns.updateCampaign.mutate>
  >[number];
  try {
    [result] = await api.campaigns.updateCampaign.mutate(payload);

    if (!result || !result.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const campaign = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we updated a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.updated',
      data: {
        id: campaign.id,
        name: campaign.name,
        budget: campaign.budget,
        budget_type: campaign.budgetType,
        advertiser_id: campaign.advertiserId,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        alt_id: campaign.altId,
        user_id: userId,
        frequency: campaign.frequency,
        frequency_period: campaign.frequencyPeriod,
      },
    });
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'campaign_name'
    ) {
      return {
        field: 'name' as CampaignFields,
        message: 'Campaign name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  const nextTgId = await api.targetingGroups.getNextTargetingGroupId.query({
    campaignId: result.id,
  });

  if (nextTgId) {
    redirect(`/campaigns/${result.id}/targeting-groups/${nextTgId}/edit`);
  }

  redirect(`/campaigns/${result.id}/targeting-groups/new`);
}

/**
 * Activate a campaign
 */
export async function activateCampaign(campaignId: string) {
  let result: Awaited<
    ReturnType<typeof api.campaigns.updateCampaign.mutate>
  >[number];
  try {
    const draftCampaignData = await api.campaigns.getCampaign.query({
      id: campaignId,
    });
    const { altId, status, updatedAt, ...draftCampaign } = draftCampaignData[0];

    [result] = await api.campaigns.updateCampaign.mutate({
      ...draftCampaign,
      status: 'published',
    });

    if (!result || !result.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const campaign = result;
    const user = await currentUser();

    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we activated a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.activated',
      data: {
        id: campaign.id,
        name: campaign.name,
        advertiser_id: campaign.advertiserId,
        alt_id: campaign.altId,
        user_id: userId,
      },
    });
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'campaign_name'
    ) {
      return {
        field: 'name' as CampaignFields,
        message: 'Campaign name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  redirect(`/campaigns/${result.id}?details=true`);
}

/**
 * Stop a campaign
 */
export async function stopCampaign(payload: FormCampaign & { id: string }) {
  let result: Awaited<
    ReturnType<typeof api.campaigns.updateCampaign.mutate>
  >[number];
  let targetingGroups: Awaited<
    ReturnType<typeof api.targetingGroups.getTargetingGroups.query>
  > = [];
  try {
    [result] = await api.campaigns.updateCampaign.mutate(payload);

    if (!result || !result.id || !result.externalId)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    // Get targeting group IDs
    targetingGroups = await api.targetingGroups.getTargetingGroups.query({
      campaignId: result.id,
    });
    const targetingGroupIDs: string[] = [];
    targetingGroups.forEach((tg) => {
      if (tg.externalId) {
        targetingGroupIDs.push(tg.externalId);
      }
    });

    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we stopped a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.deleted',
      data: {
        id: result.id,
        name: result.name,
        advertiser_id: result.advertiserId,
        external_id: result.externalId,
        targeting_group_ids: targetingGroupIDs,
        user_id: userId,
      },
    });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/campaigns');
  redirect(`/campaigns`);
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string) {
  let result: Awaited<
    ReturnType<typeof api.campaigns.deleteCampaign.mutate>
  >[number];
  let targetingGroups: Awaited<
    ReturnType<typeof api.targetingGroups.getTargetingGroups.query>
  > = [];
  try {
    // We need to get targeting groups here because they will be deleted from
    //  the DB before our Inngest function runs.
    targetingGroups = await api.targetingGroups.getTargetingGroups.query({
      campaignId: id,
    });
    const targetingGroupIDs: string[] = [];
    targetingGroups.forEach((tg) => {
      if (tg.externalId) {
        targetingGroupIDs.push(tg.externalId);
      }
    });

    [result] = await api.campaigns.deleteCampaign.mutate(id);
    if (!result || !result.id || !result.externalId)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we deleted a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.deleted',
      data: {
        id: result.id,
        name: result.name,
        advertiser_id: result.advertiserId,
        external_id: result.externalId,
        targeting_group_ids: targetingGroupIDs,
        user_id: userId,
      },
    });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/campaigns');
  redirect(`/campaigns`);
}

/**
 * Clone Campaign
 */
export async function cloneCampaign({
  cloneData,
  originalId,
}: {
  cloneData: FormCampaign;
  originalId: string;
}) {
  console.log('in clone campaign');
  let result: Awaited<ReturnType<typeof api.campaigns.cloneCampaign.mutate>>;
  try {
    result = await api.campaigns.cloneCampaign.mutate({
      cloneData,
      originalId,
    });

    if (!result || !result.campaign.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const { campaign, targetingGroups } = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we created a campaign
     */
    await inngest.send({
      name: 'campaigns/campaign.created',
      data: {
        id: campaign.id,
        name: campaign.name,
        budget: campaign.budget,
        budget_type: campaign.budgetType,
        advertiser_id: campaign.advertiserId,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        alt_id: campaign.altId,
        user_id: userId,
        frequency: campaign.frequency,
        frequency_period: campaign.frequencyPeriod,
      },
    });

    // TODO: send an event to Inngest for each targeting group
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'campaign_name'
    ) {
      return {
        field: 'name' as CampaignFields,
        message: 'Campaign name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath(`/campaigns/${result.campaign.id}/summary`);
  redirect(`/campaigns/${result.campaign.id}/summary`);
}

// --------------------------------------------------
// Targeting Groups
// --------------------------------------------------

/**
 * Save a new 'draft' of a targeting group if a user selects 'save draft' instead of 'save and continue'
 */
export async function saveDraftTargetingGroup(payload: FormTargetingGroup) {
  const mutation = payload.id
    ? api.targetingGroups.updateTargetingGroup
    : api.targetingGroups.createTargetingGroup;

  const result = await mutation.mutate(
    payload as Parameters<typeof mutation.mutate>[0],
  );

  if (!result?.length || !result[0].id)
    throw new Error(
      'Something went wrong; please try again or contact support',
    );

  const targetingGroup = result[0];
  const user = await currentUser();
  const userId = user ? user.id : 'unknown';
  const geoTargeting = {
    country: ['USA'],
    city: targetingGroup.geoCities,
    region: [],
    metro: [],
    zip: targetingGroup.geoZipCodes,
  };

  /**
   * Send an event to Inngest incase anything cares that we updated a draft targeting group
   */
  if (payload.id) {
    await inngest.send({
      name: 'targetingGroups/targetingGroup.updated',
      data: {
        id: targetingGroup.id,
        campaign_id: targetingGroup.campaignId,
        budget: targetingGroup.budget,
        name: targetingGroup.name,
        alt_id: targetingGroup.altId,
        user_id: userId,
        geo_targeting: geoTargeting,
        inventories: targetingGroup.inventories,
        age: targetingGroup.age,
        categories: targetingGroup.categories,
        gender: targetingGroup.gender,
      },
    });
  } else {
    await inngest.send({
      name: 'targetingGroups/targetingGroup.created',
      data: {
        id: targetingGroup.id,
        campaign_id: targetingGroup.campaignId,
        budget: targetingGroup.budget,
        name: targetingGroup.name,
        alt_id: targetingGroup.altId,
        user_id: userId,
        geo_targeting: geoTargeting,
        inventories: targetingGroup.inventories,
        age: targetingGroup.age,
        categories: targetingGroup.categories,
        gender: targetingGroup.gender,
      },
    });
  }

  revalidatePath('/campaigns');
  redirect(`/campaigns`);
}

/**
 * Create a new targeting group if a user selects 'save and continue'
 */
export async function createTargetingGroup({
  selectedCreative,
  ...payload
}: FormTargetingGroup & { selectedCreative: string }) {
  const result = await api.targetingGroups.createTargetingGroup.mutate(payload);
  if (!result?.length || !result[0].id)
    throw new Error(
      'Something went wrong; please try again or contact support',
    );

  const targetingGroup = result[0];
  const user = await currentUser();
  const userId = user ? user.id : 'unknown';
  const geoTargeting = {
    country: ['USA'],
    city: targetingGroup.geoCities,
    region: [],
    metro: [],
    zip: targetingGroup.geoZipCodes,
  };

  const targetingGroupCreativeRecord = await createTargetingGroupCreative({
    selectedCreative,
    targetingGroupId: targetingGroup.id,
  });

  /**
   * Send an event to Inngest incase anything cares that we created a targeting group
   */
  await inngest.send({
    name: 'targetingGroups/targetingGroup.created',
    data: {
      id: targetingGroup.id,
      campaign_id: targetingGroup.campaignId,
      budget: targetingGroup.budget,
      name: targetingGroup.name,
      alt_id: targetingGroup.altId,
      user_id: userId,
      geo_targeting: geoTargeting,
      inventories: targetingGroup.inventories,
      age: targetingGroup.age,
      categories: targetingGroup.categories,
      gender: targetingGroup.gender,
    },
  });

  revalidatePath(`/campaigns/${payload.campaignId}/summary`);
  redirect(`/campaigns/${payload.campaignId}/summary`);
}

/**
 * Update an existing targeting group if a user selects 'save and continue'
 */
export async function updateTargetingGroup(
  {
    selectedCreative,
    targetingGroupCreative,
    ...payload
  }: FormTargetingGroup & { id: string } & {
    selectedCreative: string;
    targetingGroupCreative: TargetingGroupCreative;
  },
  redirectPath?: string,
) {
  const result = await api.targetingGroups.updateTargetingGroup.mutate(payload);

  if (!result?.length || !result[0].id)
    throw new Error(
      'Something went wrong; please try again or contact support',
    );

  const targetingGroup = result[0];
  const user = await currentUser();
  const userId = user ? user.id : 'unknown';
  const geoTargeting = {
    country: ['USA'],
    city: targetingGroup.geoCities,
    region: [],
    metro: [],
    zip: targetingGroup.geoZipCodes,
  };

  const updatedTargetingGroupCreative = await updateTargetingGroupCreative({
    targetingGroupCreative,
    selectedCreative,
  });

  /**
   * Send an event to Inngest incase anything cares that we updated a targeting group
   */
  await inngest.send({
    name: 'targetingGroups/targetingGroup.updated',
    data: {
      id: targetingGroup.id,
      campaign_id: targetingGroup.campaignId,
      budget: targetingGroup.budget,
      name: targetingGroup.name,
      alt_id: targetingGroup.altId,
      user_id: userId,
      geo_targeting: geoTargeting,
      inventories: targetingGroup.inventories,
      age: targetingGroup.age,
      categories: targetingGroup.categories,
      gender: targetingGroup.gender,
    },
  });

  if (redirectPath) {
    redirect(redirectPath);
  }

  revalidatePath(`/campaigns/${result[0].campaignId}/summary`);
  redirect(`/campaigns/${result[0].campaignId}/summary`);
}

export async function deleteTargetingGroup(id: string) {
  try {
    const result = await api.targetingGroups.deleteTargetingGroup.mutate(id);
    const targetingGroup = result[0];

    if (!targetingGroup)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    revalidatePath('/campaigns');
    redirect('/campaigns');
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }
}

export const createTargetingGroupCreative = async ({
  selectedCreative,
  targetingGroupId,
}: {
  selectedCreative: string;
  targetingGroupId: string;
}) => {
  const targetingGroupCreative =
    await api.targetingGroupCreatives.createTargetingGroupCreative.mutate({
      creativeId: selectedCreative,
      targetingGroupId: targetingGroupId,
    });
  return targetingGroupCreative;
};

export const updateTargetingGroupCreative = async ({
  targetingGroupCreative,
  selectedCreative,
}: {
  selectedCreative: string;
  targetingGroupCreative: TargetingGroupCreative;
}) => {
  const updatedTargetingGroupCreative =
    api.targetingGroupCreatives.updateTargetingGroupCreative.mutate({
      ...targetingGroupCreative,
      creativeId: selectedCreative,
    });

  return updatedTargetingGroupCreative;
};

export const getTargetingGroupCreative = async (targetingGroupId: string) => {
  const [targetingGroupCreative] =
    await api.targetingGroupCreatives.getTargetingGroupCreative.query({
      targetingGroupId,
    });
  return targetingGroupCreative;
};

export const deleteOrganization = async () => {
  await api.organizations.deleteOrganization.mutate();
};

export const updateProfile = async ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  await api.users.updateProfile.mutate({
    firstName,
    lastName,
  });

  revalidatePath('/settings/general');
};

// --------------------------------------------------
// Advertisers
// --------------------------------------------------

/**
 * Create a new advertiser
 */
export async function createAdvertiser(
  payload: z.infer<typeof InsertAdvertiserSchema>,
  redirectUrl?: string,
) {
  let result: Awaited<
    ReturnType<typeof api.advertisers.insertAdvertiser.mutate>
  >[number];

  try {
    [result] = await api.advertisers.insertAdvertiser.mutate(payload);

    if (!result || !result.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const advertiser = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we created an advertiser
     */
    await inngest.send({
      name: 'advertisers/advertiser.created',
      data: {
        id: advertiser.id,
        name: advertiser.name,
        website: advertiser.website,
        industry: advertiser.industry,
        alt_id: advertiser.altId,
        user_id: userId,
      },
    });
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError
    ) {
      console.log(e?.cause?.cause);
      if (e.cause.cause.constraint === 'advertisers_website_unique') {
        return {
          field: 'website' as keyof typeof InsertAdvertiserSchema.shape,
          message: 'Advertiser website must be unique',
        };
      }
      if (e?.cause?.cause?.constraint === 'advertiser_name') {
        return {
          field: 'name' as keyof typeof InsertAdvertiserSchema.shape,
          message: 'Advertiser name must be unique',
        };
      }
      return {
        message: 'Something went wrong; please try again or contact support',
      };
    }
  }

  /**
   * Clear server-side cache for RSCs, and return a 302 navigation header to client
   */
  if (redirectUrl) {
    revalidatePath(redirectUrl);
    redirect(redirectUrl);
  }
}

/**
 * Update an existing advertiser if a user selects 'save and continue'
 */
export async function updateAdvertiser(
  payload: FormAdvertiser & { id: string },
) {
  let result: Awaited<
    ReturnType<typeof api.advertisers.updateAdvertiser.mutate>
  >[number];
  try {
    if (payload.logoUrl) {
      const oldAdvertiser = await api.advertisers.getAdvertiser.query(
        payload.id,
      );
      if (oldAdvertiser && oldAdvertiser.logoUrl) {
        del(oldAdvertiser.logoUrl);
      }
    }
    [result] = await api.advertisers.updateAdvertiser.mutate(payload);

    if (!result || !result.id)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const advertiser = result;
    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we updated an advertiser
     */
    await inngest.send({
      name: 'advertisers/advertiser.updated',
      data: {
        // TODO: add `active` if we add an active/inactive state for advertisers in skybeam
        id: advertiser.id,
        name: advertiser.name,
        website: advertiser.website,
        industry: advertiser.industry,
        alt_id: advertiser.altId,
        user_id: userId,
      },
    });
  } catch (e) {
    // TODO: this is a hacky way to handle unique constraint errors
    if (
      e instanceof TRPCClientError &&
      e?.cause?.cause instanceof NeonDbError &&
      e?.cause?.cause?.constraint === 'advertiser_name'
    ) {
      return {
        field: 'name' as keyof typeof InsertAdvertiserSchema.shape,
        message: 'Advertiser name must be unique',
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  redirect(`/settings/advertiser`);
}

/**
 * Delete an Advertiser
 */
export async function deleteAdvertiser(id: string) {
  let result: Awaited<
    ReturnType<typeof api.advertisers.deleteAdvertiser.mutate>
  >[number];
  try {
    [result] = await api.advertisers.deleteAdvertiser.mutate(id);

    if (!result || !result.id || !result.externalId)
      throw new Error(
        'Something went wrong; please try again or contact support',
      );

    const user = await currentUser();
    const userId = user ? user.id : 'unknown';

    /**
     * Send an event to Inngest incase anything cares that we deleted an advertiser
     */
    await inngest.send({
      name: 'advertisers/advertiser.deleted',
      data: {
        id: result.id,
        name: result.name,
        website: result.website,
        industry: result.industry,
        external_id: result.externalId,
        user_id: userId,
      },
    });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/settings/advertiser');
  redirect(`/settings/advertiser`);
}

// --------------------------------------------------
// Users
// --------------------------------------------------

export async function resetPassword({
  newPassword,
  oldPassword,
  oldPassword2,
}: {
  newPassword: string;
  oldPassword: string;
  oldPassword2: string;
}) {
  if (oldPassword !== oldPassword2) {
    return {
      field: 'oldPassword',
      message: 'Old passwords do not match',
    };
  }

  try {
    await api.users.resetPassword.mutate({
      newPassword,
      oldPassword,
      oldPassword2,
    });
  } catch (e) {
    if (
      e instanceof TRPCClientError &&
      typeof e.cause?.cause === 'object' &&
      e.cause.cause &&
      'errors' in e.cause.cause &&
      e.cause.cause.errors &&
      Array.isArray(e.cause.cause.errors)
    ) {
      return {
        message: e.cause.cause.errors?.at(0)?.message,
      };
    }
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }
}

export async function deletePaymentMethod(defaultPayment: string) {
  await api.stripe.deletePaymentMethod.mutate({ defaultPayment });
  revalidatePath('/settings/payment');
  redirect('/settings/payment');
}

export async function deleteAccount(userId: string) {
  let result: Awaited<ReturnType<typeof api.users.deleteUser.mutate>>;
  try {
    result = await api.users.deleteUser.mutate({ userId });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/settings/users');
  redirect('/settings/users');
}

/**
 * Removes membership from org
 */

export async function deactivateAccount(userId: string) {
  let result: Awaited<
    ReturnType<typeof api.organizations.removeMembership.mutate>
  >;
  try {
    result = await api.organizations.removeMembership.mutate({ userId });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/settings/users');
  redirect('/settings/users');
}

/**
 * Invite a new user to an organization
 */

export async function inviteUser(payload: { email: string; name: string }) {
  let result: Awaited<ReturnType<typeof api.organizations.inviteMember.mutate>>;
  try {
    result = await api.organizations.inviteMember.mutate(payload);
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/settings/users/invites');
  redirect('/settings/users/invites');
}

/**
 * revoke invitation
 */

export async function revokeInvitation(inviteId: string) {
  let result: Awaited<ReturnType<typeof api.organizations.revokeInvite.mutate>>;
  try {
    result = await api.organizations.revokeInvite.mutate({ inviteId });
  } catch (e) {
    return {
      message: 'Something went wrong; please try again or contact support',
    };
  }

  revalidatePath('/settings/users/invites');
  redirect('/settings/users/invites');
}

export async function addPaymentMethod(
  payload: { clientSecret: string },
  redirectUrl?: string,
) {
  const redirectPath = redirectUrl || '/settings/payment';
  await api.stripe.savePaymentMethod.mutate(payload);
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function changeMembershipRole(payload: {
  userId: string;
  role: string;
}) {
  await api.organizations.changeMembership.mutate(payload);
  revalidatePath('/settings/users');
}

export async function assignPixel(payload: {
  name: string;
  advertiserId: string;
}) {
  return await api.pixels.assignPixel.mutate(payload);
}

export async function goToCampaignList() {
  revalidatePath('/campaigns');
  redirect('/campaigns');
}
