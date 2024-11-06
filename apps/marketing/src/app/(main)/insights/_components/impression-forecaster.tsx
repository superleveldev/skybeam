'use client';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@limelight/shared-ui-kit/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@limelight/shared-ui-kit/ui/select';
import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import ForecastResults from './forecast-results';
import Slider from './slider';
import MetrosMultiselect from './metros-multiselect';

import { debounce, formatLargeNumber } from '@limelight/shared-utils/index';
import { api } from '../../../../trpc/react';
import { forecastImpact, ForecastImpactResults } from '../_utils';

const ForecasterSchema = z.object({
  audience: z.string().min(1),
  budget: z.number().min(50),
  locations: z.array(z.string()).min(1).max(10),
});

type ForecasterFormValues = z.infer<typeof ForecasterSchema>;

export default function ImpressionForecaster() {
  const [forecastResults, setForecastResults] = useState<
    ForecastImpactResults | undefined
  >(undefined);
  const form = useForm<ForecasterFormValues>({
    resolver: zodResolver(ForecasterSchema),
    defaultValues: {
      audience: '',
      budget: 500,
      locations: [],
    },
  });

  const {
    watch,
    setValue,
    getValues,
    formState: { isValid },
  } = form;
  const monthlyBudget = watch('budget');

  const handleSliderChange = (value: number[]) => {
    setValue('budget', value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^\d]/g, '');
    const value = Number(numericValue);
    setValue('budget', value);
  };

  const { data: audiences } = api.impressionForecaster.audience.useQuery(
    undefined,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );

  async function onSubmit(data: ForecasterFormValues) {
    if (!form.formState.isValid) {
      return;
    }
    try {
      const response = await forecastImpact({
        audienceName: data.audience,
        budget: data.budget,
        locations: data.locations ? data.locations : [],
      });
      setForecastResults(response);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  }

  useEffect(() => {
    const debouncedSubmit = debounce(onSubmit, 250);
    const subscription = form.watch(() => {
      const values = getValues();
      debouncedSubmit(values);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="relative w-full desktop:px-[152px] laptop:px-10 tablet:px-6 px-4 desktop:flex desktop:justify-center">
      <div className="desktop:-translate-y-[300px] -translate-y-[400px]">
        <h1 className="font-proxima-nova laptop:text-[100px] text-[2.875rem] text-[#FFFFFF] leading-[0.95] laptop:leading-[0.9]  tracking-[-0.46px] tablet:tracking-[-0.65px] laptop:tracking-[-1px]  pb-4 laptop:pb-6">
          TV Impact Forecaster
        </h1>
        <p className="text-[#FFFFFF] text-[0.875rem] desktop:text-[1.125rem] font-proxima-nova pb-8">
          Efficiently estimate your TV campaign's impact to make every dollar
          count
        </p>
        <Card className="w-ful desktop:min-w-[1136px] rounded-[8px] tablet:rounded-[16px] laptop:rounded-[24px] pb-4 tablet:pb-6  pt-6 px-4 laptop:p-10 shadow-lg leading-[1.5] tablet:leading-[1.75] laptop:leading-[1.55]">
          <CardContent className="px-0 pb-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2 h-full">
                  <div className="flex flex-col space-y-6 h-full">
                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className="h-full">
                            <FormLabel className="text-base text-muted-foreground font-[400]">
                              Monthly Budget
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737C8B]">
                                  $
                                </span>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="0.00"
                                  className="pl-10 text-[1rem]"
                                  {...field}
                                  value={
                                    field.value
                                      ? formatLargeNumber({
                                          number: field.value,
                                        })
                                      : ''
                                  }
                                  onChange={handleInputChange}
                                />
                              </div>
                            </FormControl>
                            <div className="py-2">
                              <Slider
                                value={monthlyBudget}
                                onValueChange={handleSliderChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base text-muted-foreground font-[400]">
                              Audience
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Audience" />
                                </SelectTrigger>
                                <SelectContent>
                                  {audiences?.map((audience) => (
                                    <SelectItem
                                      key={audience.name}
                                      value={audience.name}
                                    >
                                      {audience.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <p className="text-[0.75rem] text-[#737C8B] leading-[1]">
                              Choose an initial audience to explore. Access the
                              full range of 250+ audience options within
                              {'\u00A0'}the{'\u00A0'}
                              <Link
                                href="https://app.skybeam.io/sign-in"
                                className="text-primary underline text-[0.75rem] leading-[1]"
                              >
                                Skybeam platform.
                              </Link>
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <MetrosMultiselect />
                  </div>
                </div>

                <ForecastResults
                  estimatedAudienceSize={
                    isValid ? forecastResults?.estimatedAudienceSize : undefined
                  }
                  forecastedImpressions={
                    isValid ? forecastResults?.forecastedImpressions : undefined
                  }
                  websiteVisits={
                    isValid ? forecastResults?.websiteVisits : undefined
                  }
                  incrementalClicks={
                    isValid ? forecastResults?.incrementalClicks : undefined
                  }
                />
              </form>
              <Link href="https://app.skybeam.io/sign-in" type="button">
                <Button
                  data-test-calculate-btn
                  variant="default"
                  className="mt-4 w-full text-[0.875rem] tablet:text-[1rem] hover:bg-[#497CFF]"
                >
                  <Play className="hidden tablet:block w-5 h-5 mr-2" />
                  Launch Your TV Ad in 5 Minutes
                </Button>
              </Link>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
