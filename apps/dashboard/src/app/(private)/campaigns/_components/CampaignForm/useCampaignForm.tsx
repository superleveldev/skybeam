'use client';

import { useEffect, useRef, useState } from 'react';
import { Campaign } from '../../types';
import { api } from '../../../../../trpc/react';
import { useTimezoneSelect } from 'react-timezone-select';
import { useFormContext } from 'react-hook-form';
import { FormCampaign } from '@limelight/shared-drizzle';
import {
  cloneCampaign,
  createCampaign,
  saveDraftCampaign,
  updateCampaign,
} from '../../../../../server/actions';
import { toast } from 'sonner';

export interface CampaignFormProps {
  campaign?: Campaign;
}

export const RECOMMENDED_DAILY_FREQUENCY = 4;
export const RECOMMENDED_WEEKLY_FREQUENCY = 12;

export function useCampaignForm({ campaign }: CampaignFormProps) {
  const [open, toggleOpen] = useState(false);
  const [advertiserSelectOpen, toggleAdvertiserSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: { data: advertisers } = { data: [] }, refetch: _refetch } =
    api.advertisers.getAdvertisers.useQuery(
      {},
      {
        refetchOnWindowFocus: false,
        notifyOnChangeProps: ['data'],
      },
    );

  const { options } = useTimezoneSelect({
    labelStyle: 'original',
  });

  const newAdvertiserId = useRef<string | null>(null);

  const refetch = async () => {
    const res = await _refetch();
    if (res?.data?.data?.length) {
      newAdvertiserId.current = res.data.data[0].id;
    }
    return res;
  };

  const form = useFormContext<FormCampaign>();

  const [budgetTypeWatch, objectiveWatch, frequencyPeriodWatch] = form.watch([
    'budgetType',
    'objective',
    'frequencyPeriod',
  ]);

  console.log(form.formState.isValid, form.formState.errors);

  useEffect(() => {
    if (newAdvertiserId.current) {
      form.setValue('advertiserId', newAdvertiserId.current);
      newAdvertiserId.current = null;
    }
  }, [newAdvertiserId.current]);

  useEffect(() => {
    form.reset(campaign);
  }, [campaign]);

  useEffect(() => {
    form.clearErrors('budget');
    form.trigger('budget');
  }, [budgetTypeWatch]);

  useEffect(() => {
    if (objectiveWatch === 'retargeting') {
      form.setValue('budgetType', 'lifetime');
    }
    form.clearErrors('budget');
    form.trigger('budget');
  }, [objectiveWatch]);

  function onSubmit({
    isDraft = true,
    isClone = false,
  }: {
    isDraft: boolean;
    isClone: boolean;
  }) {
    return async function (values: FormCampaign) {
      setIsLoading(true);
      let error: Awaited<ReturnType<typeof saveDraftCampaign>> | null = null;

      if (isClone) {
        if (!campaign) {
          throw new Error('Campaign is required to clone');
        }
        const {
          id,
          status,
          altId,
          updatedAt,
          beeswaxSync,
          createdAt,
          ..._cloneData
        } = values;
        console.log('values', values);
        const cloneData: FormCampaign = { ..._cloneData, status: 'draft' };
        error = await cloneCampaign({
          cloneData,
          originalId: campaign.id,
        });
      } else if (isDraft) {
        error = await saveDraftCampaign(values);
      } else if (campaign?.id) {
        error = await updateCampaign({ ...values, id: campaign.id });
      } else {
        error = await createCampaign(values);
      }

      if (!error) {
        toast.success(`Campaign saved!`);
        setIsLoading(false);
        return;
      }

      if (error?.field) {
        form.setError(
          error.field,
          {
            type: 'value',
            message: error.message,
          },
          { shouldFocus: true },
        );
        setIsLoading(false);
        return;
      }

      toast.error('Error', {
        description: error?.message || 'An error occurred',
      });
      setIsLoading(false);
    };
  }

  return {
    open,
    toggleOpen,
    advertiserSelectOpen,
    toggleAdvertiserSelectOpen,
    advertisers,
    refetch,
    options,
    form,
    budgetTypeWatch,
    objectiveWatch,
    onSubmit,
    recommendedFrequency:
      frequencyPeriodWatch === 'day'
        ? RECOMMENDED_DAILY_FREQUENCY
        : RECOMMENDED_WEEKLY_FREQUENCY,
    isLoading,
  };
}
