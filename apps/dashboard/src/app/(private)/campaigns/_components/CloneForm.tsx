'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormCampaign, InsertCampaignSchema } from '@limelight/shared-drizzle';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CampaignFormProps,
  useCampaignForm,
} from './CampaignForm/useCampaignForm';
import CampaignNameInput from './CampaignNameInput';
import CampaignTimeline from './CampaignTimeline';
import { Form } from '@limelight/shared-ui-kit/ui/form';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { addDays, differenceInDays, isBefore } from 'date-fns';
import { z } from 'zod';
import { RefreshCcw } from 'lucide-react';

export default function CloneFormContainer({ campaign }: CampaignFormProps) {
  const form = useForm<FormCampaign & { pixelId?: string }>({
    resolver: zodResolver(
      InsertCampaignSchema.superRefine(
        ({ startDate, endDate, objective }, refinementContext) => {
          if (isBefore(endDate, startDate)) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End date must be after start date',
              path: ['endDate'],
            });
          }
          if (
            objective === 'retargeting' &&
            differenceInDays(endDate, startDate) !== 30
          ) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Retargeting Campaigns must be 30 days long',
              path: ['endDate'],
            });
          }
          const minDays = objective === 'retargeting' ? -Infinity : 3;
          if (differenceInDays(endDate, startDate) < minDays) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${
                objective === 'retargeting'
                  ? 'Retargeting Campaigns'
                  : 'Campaign'
              } must be at least ${minDays} days long`,
              path: ['endDate'],
            });
          }
          if (isBefore(startDate, addDays(new Date(), 1))) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Start date must be at least 1 day in the future',
              path: ['startDate'],
            });
          }
        },
      ),
    ),
    defaultValues: {
      name: campaign?.name,
      objective: campaign?.objective,
      advertiserId: campaign?.advertiserId,
      budgetType: campaign?.budgetType,
      budget: campaign?.budget,
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 4),
      timezone: campaign?.timezone,
      pixelId: campaign?.pixelId ?? undefined,
    },
  });

  return (
    <FormProvider {...form}>
      <CloneForm campaign={campaign} />
    </FormProvider>
  );
}

function CloneForm({ campaign }: CampaignFormProps) {
  const { form, onSubmit, isLoading } = useCampaignForm({ campaign });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit({ isDraft: true, isClone: true }))}
      >
        <CampaignNameInput />
        <span className="text-base font-medium mt-4 inline-block">
          Timeline
        </span>
        <CampaignTimeline isClone />
        <div className="flex justify-between px-2 mt-4">
          <Button
            className="mt-2 flex justify-center gap-2"
            type="submit"
            disabled={isLoading}
          >
            Save and Continue
            {isLoading && <RefreshCcw className="size-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
