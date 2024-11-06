'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Input } from '@limelight/shared-ui-kit/ui/input';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@limelight/shared-ui-kit/ui/select';
import {
  CalendarHeart,
  CalendarPlus2,
  CirclePlus,
  Flag,
  Goal,
  InfoIcon,
  Repeat,
  Tv,
} from 'lucide-react';
import AdvertiserModal from '../../../_components/AdvertiserModal';
import RadioCard from '../../../_components/RadioCard';
import { RadioGroup as RadioGroupPrimitive } from '@radix-ui/react-radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import { CampaignFormProps, useCampaignForm } from './useCampaignForm';
import PixelSelection from '../PixelSelection';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormCampaign,
  frequencyPeriodEnum,
  InsertCampaignSchema,
} from '@limelight/shared-drizzle';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@limelight/shared-utils/index';
import { addDays, addHours, differenceInDays, isBefore } from 'date-fns';
import CampaignNameInput from '../CampaignNameInput';
import CampaignTimeline from '../CampaignTimeline';
import { fromZonedTime } from 'date-fns-tz';

export default function CampaignFormContainer({ campaign }: CampaignFormProps) {
  const form = useForm<FormCampaign & { pixelId?: string }>({
    resolver: zodResolver(
      InsertCampaignSchema.superRefine(
        (
          {
            pixelId,
            objective,
            budgetType,
            budget,
            startDate,
            endDate,
            status,
          },
          refinementContext,
        ) => {
          if (objective === 'retargeting' && !pixelId) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Pixel is required for a retargeting objective',
              path: ['pixelId'],
            });
          }
          if (budgetType === 'daily' && budget < 50) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Minimum daily budget for daily campaigns is $50',
              path: ['budget'],
            });
          }
          const days = Math.abs(differenceInDays(startDate, endDate)) || 1;

          if (budgetType === 'lifetime') {
            if (objective === 'retargeting') {
              if (budget < 100) {
                refinementContext.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Minimum budget for a retargeting campaign is $100`,
                  path: ['budget'],
                });
              }
              if (budget > 1000) {
                refinementContext.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Maximum budget for a retargeting campaign is $1000`,
                  path: ['budget'],
                });
              }
            } else if (budget / days < 50) {
              refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Minimum budget for a ${days} day campaign is ${formatCurrency(
                  { number: 50 * days },
                )}`,
                path: ['budget'],
              });
            }
          }
          const currentUserOffset = new Date().getTimezoneOffset() / 60;
          if (
            (!status || status === 'draft') &&
            isBefore(
              startDate,
              addHours(
                fromZonedTime(new Date(), 'UTC'),
                24 - currentUserOffset,
              ),
            )
          ) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Start date must be at least 1 day in the future',
              path: ['startDate'],
            });
          }
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
        },
      ),
    ),
    defaultValues: {
      name: campaign?.name ?? '',
      objective: campaign?.objective ?? 'awareness',
      advertiserId: campaign?.advertiserId ?? '',
      budgetType: campaign?.budgetType ?? 'daily',
      budget: campaign?.budget ?? 500,
      frequency: campaign?.frequency ?? 4,
      frequencyPeriod: campaign?.frequencyPeriod ?? 'day',
      startDate: campaign?.startDate ?? addDays(new Date(), 2),
      endDate: campaign?.endDate ?? addDays(new Date(), 5),
      timezone: campaign?.timezone,
      pixelId: campaign?.pixelId ?? undefined,
    },
  });

  return (
    <FormProvider {...form}>
      <CampaignForm campaign={campaign} />
    </FormProvider>
  );
}

function CampaignForm({ campaign }: CampaignFormProps) {
  const {
    open,
    toggleOpen,
    advertiserSelectOpen,
    toggleAdvertiserSelectOpen,
    advertisers,
    refetch,
    form,
    budgetTypeWatch,
    objectiveWatch,
    onSubmit,
    recommendedFrequency,
  } = useCampaignForm({ campaign });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            if (e.target !== e.currentTarget) {
              return;
            }
            e.preventDefault();
            form.handleSubmit(onSubmit({ isDraft: false, isClone: false }))(e);
          }}
          className="w-full space-y-8"
        >
          <Card className="p-6">
            <CampaignNameInput />
          </Card>
          <Card className="p-6">
            <FormField
              control={form.control}
              name="advertiserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center gap-2">
                    Advertiser
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => field.onChange(e)}
                      open={advertiserSelectOpen}
                      onOpenChange={toggleAdvertiserSelectOpen}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="add-advertiser-trigger">
                          <SelectValue placeholder="Select an Advertiser" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {advertisers?.map((advertiser) => (
                          <SelectItem
                            key={advertiser.id}
                            value={`${advertiser.id}`}
                          >
                            {advertiser.name}
                          </SelectItem>
                        ))}
                        <Button
                          className="w-full justify-start font-medium gap-2 pl-2 text-indigo-500"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleOpen(true);
                            toggleAdvertiserSelectOpen(false);
                          }}
                        >
                          <CirclePlus className="h-4 w-4" /> Add Advertiser
                        </Button>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Advertisers are the companies whose campaigns you manage. If
                    you have multiple businesses, be sure to select the correct
                    one!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <Card className="px-6 pb-6">
            <CardHeader className="ps-2 font-medium text-base flex flex-row items-center justify-start gap-2">
              Objective
            </CardHeader>
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <>
                  <RadioGroupPrimitive
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex w-full flex-wrap justify-center gap-4 "
                  >
                    <RadioCard
                      field={field}
                      value="awareness"
                      label={
                        <div className="flex justify-center items-center gap-2">
                          <Tv className="w-4 h-4 rotate-180" />
                          Awareness
                        </div>
                      }
                      description="Reach a wide audience to boost the visibility of your site and make your name known."
                    />
                    <RadioCard
                      field={field}
                      value="retargeting"
                      label={
                        <div className="flex justify-center items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          Retargeting
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent align="start">
                                <p>
                                  Target those already familiar with your brand
                                  to maximize the chances of conversion.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      }
                      description="Re-engage viewers who have previously interacted with your brand and keep your message top of mind."
                    />
                    <RadioCard
                      field={field}
                      value="performance"
                      isComingSoon
                      label={
                        <div className="flex justify-center items-center gap-2">
                          <Goal className="w-4 h-4" />
                          Performance
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent align="start">
                                <p>
                                  Great for driving website visits, sales,
                                  leads, or other direct actions.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      }
                      description="Optimize your ads to drive conversions and get measurable results for your business."
                    />
                    <RadioCard
                      field={field}
                      value="conquering"
                      isComingSoon
                      label={
                        <div className="flex justify-center items-center gap-2">
                          <Flag className="w-4 h-4" />
                          Conquesting
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent align="start">
                                <p>
                                  Show your ad to people viewing competitor’s
                                  ads and gain new customers.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      }
                      description="Be a step ahead of your competition by targeting ads to their audience."
                    />
                  </RadioGroupPrimitive>
                  <FormMessage />
                </>
              )}
            />
            <PixelSelection />
          </Card>
          <Card className="px-6 pb-6">
            <CardHeader className="ps-2 font-medium flex-row items-center justify-start gap-2">
              Campaign Budget
            </CardHeader>
            <FormField
              control={form.control}
              name="budgetType"
              render={({ field }) => (
                <RadioGroupPrimitive
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex w-full flex-wrap justify-center gap-4 "
                >
                  <RadioCard
                    field={field}
                    label={
                      <div className="flex justify-center items-center gap-2">
                        <CalendarPlus2 className="w-4 h-4" />
                        Daily
                      </div>
                    }
                    value="daily"
                    description="Set a daily budget to control your spending and ensure consistent ad delivery."
                    disabled={objectiveWatch === 'retargeting'}
                  />
                  <RadioCard
                    field={field}
                    label={
                      <div className="flex justify-center items-center gap-2">
                        <CalendarHeart className="w-4 h-4" />
                        Lifetime
                      </div>
                    }
                    value="lifetime"
                    description="Set a total budget for the entire campaign. Ads will run until your budget is spent."
                  />
                </RadioGroupPrimitive>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="md:ms-2 mt-2 w-full md:w-[48%]">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    {budgetTypeWatch === 'daily'
                      ? 'Daily budget'
                      : 'Total campaign budget'}{' '}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        inputMode="decimal"
                        className="pl-7"
                        {...field}
                        value={formatCurrency({
                          number: field.value,
                          options: {
                            currencySign: 'accounting',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        })}
                        onChange={(e) => {
                          if (
                            /^\d*\.?\d{0,2}$/.test(
                              e.target.value.replaceAll(',', ''),
                            ) ||
                            e.target.value === ''
                          ) {
                            field.onChange(+e.target.value.replaceAll(',', ''));
                            form.trigger('budget');
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <Card className="px-6 pb-6">
            <CardHeader className="ps-2 pb-0 font-medium flex-row items-center justify-start gap-2">
              Frequency
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    <p>
                      Control how many times a viewer sees your ad each week.
                      Strike the right balance between visibility and viewer
                      experience.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardDescription className="ps-2 pb-6">
              Don't show an ad more than
            </CardDescription>
            <CardContent className="px-2 pb-2 flex gap-2 items-center justify-start">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Select
                        onValueChange={(nextVal) => {
                          field.onChange(+nextVal);
                        }}
                        value={`${field.value}`}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="add-frequency-trigger">
                            <SelectValue placeholder="Select a frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array(12)
                            .fill(null)
                            .map((_, freq) => (
                              <SelectItem
                                key={`${freq}-times-option`}
                                value={`${freq + 1}`}
                              >
                                {freq + 1} times
                                {freq + 1 === recommendedFrequency &&
                                  ' (recommended)'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="text-muted-foreground text-sm">per</span>
              <FormField
                control={form.control}
                name="frequencyPeriod"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="add-frequency-period-trigger">
                            <SelectValue placeholder="Select a period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencyPeriodEnum.enumValues.map((period) => (
                            <SelectItem key={period} value={period}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="px-6 pb-6">
            <CardHeader className="ps-2 font-medium flex-row items-center justify-start gap-2 pb-0">
              Timeline
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    <p>
                      Define the exact dates and times your campaign will run on
                      TV.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardDescription className="ms-2">
              Choose when your campaign starts and ends to fit your marketing
              plan.
            </CardDescription>
            <CampaignTimeline />
          </Card>
          <div className="flex justify-between px-2 md:px-0">
            <Button
              variant="outline"
              className="-mt-3"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit(
                  onSubmit({ isDraft: true, isClone: false }),
                )();
              }}
            >
              Save Draft
            </Button>
            <Button className="-mt-3" type="submit">
              Save and Continue
            </Button>
          </div>
        </form>
      </Form>
      <AdvertiserModal
        onSuccess={() => {
          refetch();
        }}
        open={open}
        toggleOpen={toggleOpen}
      />
    </>
  );
}
