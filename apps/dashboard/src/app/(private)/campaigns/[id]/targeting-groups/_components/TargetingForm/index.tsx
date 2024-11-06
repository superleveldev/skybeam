'use client';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import {
  TargetingGroupFormProps,
  useTargetingGroupForm,
} from './useTargetingGroupForm';
import { Separator } from '@limelight/shared-ui-kit/ui/separator';
import CategoriesAccordion from '../CategoriesAccordion';
import Inventories from '../Inventories';
import { formatCurrency } from '@limelight/shared-utils/index';
import LocationMultiselect from '../LocationMultiselect';
import { Checkbox } from '@limelight/shared-ui-kit/ui/checkbox';
import { Segment } from '../../_utils';
import CreativeUploadModal from '../CreativeUploadModal';
import CreativeForm from '../CreativeForm';
import { useEffect, useState } from 'react';

export function TargetingGroupForm(props: TargetingGroupFormProps) {
  const {
    creatives,
    form,
    onSubmit,
    open,
    selectedCreative,
    setSelectedCreative,
    toggleOpen,
    remainingBudget,
    refetch,
  } = useTargetingGroupForm(props);
  const [displayPublishedBudgetError, setPublishedBudgetError] =
    useState(false);

  useEffect(() => {
    const scrollToTop = () => {
      if (window !== undefined) {
        window.scrollTo({ top: 0 });
      }
    };
    setTimeout(scrollToTop, 0);
  }, [props.targetingGroup?.id]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmit({ isDraft: false, isClone: props.isClone }),
          )}
          className="w-full space-y-8"
        >
          <Card className="p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center gap-2">
                    Targeting Group Name
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent align="start">
                          <p>
                            Choose a clear, descriptive name. This will help you
                            manage multiple targeting groups and optimize your
                            campaign strategies.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormDescription>
                    Name this targeting group to help distinguish different ad
                    strategies within your campaign.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={
                        props.campaign.status === 'published' &&
                        !!props.targetingGroup?.id
                      }
                      placeholder="Targeting Group Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Create a name for the targeting group if you plan to create
                    more than one.{' '}
                    <Link href="#" className="text-indigo-600">
                      When do you need multiple targeting groups
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {props.campaign.objective === 'retargeting' && (
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => <Input type="hidden" {...field} />}
            />
          )}
          {props.campaign.objective !== 'retargeting' && (
            <>
              <Card className="p-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base flex items-center gap-2">
                        Targeting Group Budget
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent align="start">
                              <p>
                                Allocate budgets based on group priority. You
                                can set different budgets for various targeting
                                groups to match your campaign goals.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormDescription>
                        Set a daily budget for this targeting group to control
                        spending and optimize ad delivery.
                      </FormDescription>
                      <FormDescription>Daily budget</FormDescription>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            value={field.value > 0 ? field.value : ''}
                            onChange={(e) => {
                              if (
                                props.campaign.status === 'published' &&
                                +e.target.value < field.value
                              ) {
                                setPublishedBudgetError(true);
                                return;
                              }
                              if (displayPublishedBudgetError)
                                setPublishedBudgetError(false);

                              if (
                                /^\d*\.?\d{0,2}$/.test(e.target.value) ||
                                e.target.value === ''
                              ) {
                                field.onChange(+e.target.value);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {remainingBudget !== undefined &&
                          `${formatCurrency({
                            number: remainingBudget,
                          })} left in campaign budget`}
                      </FormDescription>
                      {displayPublishedBudgetError && (
                        <FormDescription className="font-medium text-red-500">
                          You can only increase the budget for your published
                          campaign
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
              <Card className="pb-6 px-6">
                <CardHeader className="ps-2 pb-1 font-medium flex-row items-center justify-start gap-2 text-lg">
                  Audience
                </CardHeader>
                <CardDescription className="ps-2 pb-1 text-sm text-gray-500">
                  If zero audience segments are selected, your campaign will
                  target as many people watching as possible
                </CardDescription>
                <CardContent className="px-2 pt-1 pb-6 my-1">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base flex items-center gap-2">
                          Gender
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent align="start">
                                <p>
                                  Select a specific gender or both based on your
                                  product’s focus.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormDescription>
                          Target specific genders or select both to reach a
                          broader audience.
                        </FormDescription>
                        <FormControl>
                          <>
                            {props.genders.map((segment: Segment) => (
                              <div
                                className="flex items-center space-x-2"
                                key={segment.attribute_uuid}
                              >
                                <Checkbox
                                  checked={field.value?.includes(
                                    segment.attribute_uuid,
                                  )}
                                  onCheckedChange={(e) => {
                                    if (
                                      field.value?.includes(
                                        segment.attribute_uuid,
                                      )
                                    ) {
                                      field.onChange(
                                        field.value.filter(
                                          (v) => v !== segment.attribute_uuid,
                                        ),
                                      );
                                    } else if (field.value) {
                                      field.onChange([
                                        ...field.value,
                                        segment.attribute_uuid,
                                      ]);
                                    }
                                  }}
                                  id={segment.attribute_uuid}
                                />
                                <label
                                  className="font-medium text-sm"
                                  htmlFor={segment.attribute_uuid}
                                >
                                  {segment.name}
                                </label>
                              </div>
                            ))}
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="my-4" />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base flex items-center gap-2">
                          Age
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent align="start">
                                <p>
                                  Choose the age range that best fits your ideal
                                  customer profile for better targeting.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormDescription>
                          Choose whether to target all adults or a specific age
                          group that matches your customer profile.
                        </FormDescription>
                        <FormControl>
                          <>
                            {props.ages.map((segment) => (
                              <div
                                className="flex items-center space-x-2"
                                key={segment.attribute_uuid}
                              >
                                <Checkbox
                                  checked={field.value?.includes(
                                    segment.attribute_uuid,
                                  )}
                                  onCheckedChange={(e) => {
                                    if (
                                      field.value?.includes(
                                        segment.attribute_uuid,
                                      )
                                    ) {
                                      field.onChange(
                                        field.value.filter(
                                          (v) => v !== segment.attribute_uuid,
                                        ),
                                      );
                                    } else if (field.value) {
                                      field.onChange([
                                        ...field.value,
                                        segment.attribute_uuid,
                                      ]);
                                    }
                                  }}
                                  id={segment.attribute_uuid}
                                />
                                <label
                                  className="font-medium text-sm"
                                  htmlFor={segment.attribute_uuid}
                                >
                                  {segment.name}
                                </label>
                              </div>
                            ))}
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="my-4" />
                  <CategoriesAccordion
                    categories={props.categories}
                    control={form.control}
                    selectedCategories={props.selectedCategories}
                  />
                </CardContent>
              </Card>
            </>
          )}
          <Card className="p-6">
            <LocationMultiselect
              control={form.control}
              selectedLocations={props.selectedLocations}
              selectedZipCodes={form.getValues('geoZipCodes')}
              setValue={form.setValue}
            />
          </Card>
          <Card className="p-6">
            <Inventories
              control={form.control}
              isDisabled={props.campaign.objective === 'retargeting'}
            />
          </Card>
          <Card className="px-6">
            <CreativeForm
              creatives={creatives}
              selectedCreative={selectedCreative}
              setSelectedCreative={setSelectedCreative}
              toggleOpen={toggleOpen}
            />
          </Card>
          <div className="flex justify-between px-2 md:px-0">
            <Button
              variant="outline"
              className="-mt-3"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                form.handleSubmit(
                  onSubmit({ isDraft: true, isClone: props.isClone }),
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
      <CreativeUploadModal
        advertiserId={props.advertiserId}
        onSuccess={refetch}
        open={open}
        toggleOpen={toggleOpen}
      />
    </>
  );
}
