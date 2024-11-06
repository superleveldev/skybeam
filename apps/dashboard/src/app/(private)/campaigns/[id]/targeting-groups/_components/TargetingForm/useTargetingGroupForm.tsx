import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormTargetingGroup,
  InsertTargetingGroupSchema,
  TargetingGroupCreative,
} from '@limelight/shared-drizzle';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createTargetingGroup,
  getTargetingGroupCreative,
  saveDraftTargetingGroup,
  updateTargetingGroup,
} from '../../../../../../../server/actions';
import {
  Category,
  fetchInventories,
  LocationOption,
  Segment,
} from '../../_utils/index';
import {
  getRemainingBudget,
  getTargetingGroupRedirectUrl,
} from '../../../../../../../server/queries';
import { api } from '../../../../../../../trpc/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Campaign } from '../../../../types';

export interface TargetingGroupFormProps {
  ages: Segment[];
  advertiserId: string;
  campaign: Campaign;
  categories: Category[];
  genders: Segment[];
  isClone?: boolean;
  selectedCategories?: {
    [key: string]: Segment[];
  };
  selectedLocations?: LocationOption[];
  targetingGroup?: FormTargetingGroup;
}

export function useTargetingGroupForm({
  advertiserId,
  campaign,
  targetingGroup,
}: TargetingGroupFormProps) {
  const form = useForm<FormTargetingGroup>({
    resolver: zodResolver(
      InsertTargetingGroupSchema.superRefine((args, ctx) => {
        if (
          campaign.status === 'published' &&
          targetingGroup &&
          args.budget < targetingGroup.budget
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Budget must be greater or equal to the existing targeting group budget',
            path: ['budget'],
          });
        }
        if (campaign.objective !== 'retargeting' && args.budget < 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Daily targeting group budget must be at least $50',
            path: ['budget'],
          });
        }
        if (args.geoZipCodes?.length) {
          const isValid = args.geoZipCodes.every(
            (zip) => zip.length === 5 && zip.match(/\d{5}$/),
          );
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                'Please enter valid 5-digit zip codes in a comma-separated list',
              path: ['geoZipCodes'],
            });
          }
        }
      }),
    ),
    defaultValues: {
      age: targetingGroup?.age ?? [],
      name: targetingGroup?.name ?? '',
      budget:
        campaign.objective === 'retargeting'
          ? Math.floor((campaign.budget / 30) * 100) / 100
          : targetingGroup?.budget ?? 0,
      categories: targetingGroup?.categories ?? [],
      gender: targetingGroup?.gender ?? [],
      geoCities: targetingGroup?.geoCities ?? [],
      geoZipCodes: targetingGroup?.geoZipCodes ?? [],
      inventories: targetingGroup?.inventories ?? [],
    },
  });
  useEffect(() => {
    const getInventories = async () => {
      const data = await fetchInventories();
      const ids = data.map((inventory) => `${inventory.beeswaxListId}`);
      form.setValue('inventories', ids);
    };

    getInventories();
  }, []);

  const [remainingBudget, setRemainingBudget] = useState<number>();
  const [targetingGroupCreative, setTargetingGroupCreative] =
    useState<TargetingGroupCreative | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);

  const [budgetWatch] = form.watch(['budget']);

  const { data: creatives = [], refetch } =
    api.creatives.getCreativesByAdvertiser.useQuery(
      { advertiserId },
      {
        refetchOnWindowFocus: false,
        notifyOnChangeProps: ['data'],
      },
    );

  useEffect(() => {
    const getTargetingGroupCreativeWrapper = async () => {
      if (targetingGroup?.id) {
        const record = await getTargetingGroupCreative(targetingGroup.id);
        if (record) {
          setTargetingGroupCreative(record);
          setSelectedCreative(record.creativeId);
        }
      }
    };
    getTargetingGroupCreativeWrapper();
  }, []);

  useEffect(() => {
    form.reset({ ...(targetingGroup ?? {}), campaignId: campaign.id });
  }, [campaign.id, targetingGroup]);

  const [open, toggleOpen] = useState<boolean>(false);

  useEffect(() => {
    const getRemaining = async () => {
      if (campaign.id && budgetWatch !== undefined) {
        const { remaining, campaignDuration } = await getRemainingBudget({
          campaignId: campaign.id,
          budget: budgetWatch,
          currentTgId: targetingGroup?.id,
        });
        const tgBudget = (budgetWatch ?? 0) * campaignDuration;
        setRemainingBudget(remaining - tgBudget);
      }
    };
    getRemaining();
  }, [budgetWatch]);

  useEffect(() => {
    if (remainingBudget !== undefined && remainingBudget < 0) {
      form.setError('budget', { message: 'Budget exceeds campaign budget' });
      return;
    }
    form.trigger('budget');
  }, [remainingBudget]);

  function onSubmit({
    isDraft,
    isClone = false,
  }: {
    isDraft: boolean;
    isClone?: boolean;
  }) {
    return async function (values: FormTargetingGroup) {
      if (!selectedCreative) {
        toast.error('Please select a creative');
        return;
      }
      try {
        if (isClone) {
          if (!targetingGroup) {
            throw new Error('Targeting Group is required to clone');
          }
          const { id, altId, updatedAt, createdAt, ..._cloneData } = values;
          const cloneData: FormTargetingGroup = { ..._cloneData };
          await createTargetingGroup({ selectedCreative, ...cloneData });
        } else if (isDraft) {
          await saveDraftTargetingGroup(values);
        } else if (targetingGroup?.id) {
          if (!targetingGroupCreative) {
            toast.error('Error: No targeting group creative found');
            throw new Error('No targeting group creative found');
          }
          const redirectPath =
            (await getTargetingGroupRedirectUrl({
              campaignId: campaign.id,
              currentTgId: targetingGroup.id,
            })) || undefined;

          await updateTargetingGroup(
            {
              selectedCreative,
              targetingGroupCreative,
              ...values,
              id: targetingGroup.id,
            },
            redirectPath,
          );
        } else {
          await createTargetingGroup({ selectedCreative, ...values });
        }
        toast.success(`Targeting group saved!`);
      } catch (e) {
        toast.error('Error saving targeting group');
      }
    };
  }

  return {
    creatives,
    form,
    onSubmit,
    open,
    toggleOpen,
    refetch,
    remainingBudget,
    selectedCreative,
    setSelectedCreative,
  };
}
