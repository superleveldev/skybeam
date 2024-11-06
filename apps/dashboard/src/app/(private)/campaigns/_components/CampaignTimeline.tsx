'use client';

import { defaultTimezone, FormCampaign } from '@limelight/shared-drizzle';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { Calendar } from '@limelight/shared-ui-kit/ui/calendar';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@limelight/shared-ui-kit/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@limelight/shared-ui-kit/ui/select';
import { cn } from '@limelight/shared-utils/index';
import { addDays, addHours, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { useFormContext } from 'react-hook-form';
import { useTimezoneSelect } from 'react-timezone-select';
import { Campaign } from '../types';

function getDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

function getTimeString(date: Date) {
  return date.toISOString().split('T')[1].slice(0, 5);
}

export default function CampaignTimeline({ isClone }: { isClone?: boolean }) {
  const { control, setValue, watch, trigger } = useFormContext<FormCampaign>();

  const [startDateString, setStartDateString] = useState<string>();
  const [startTimeString, setStartTimeString] = useState<string>('00:00');

  const [endDateString, setEndDateString] = useState<string>();
  const [endTimeString, setEndTimeString] = useState<string>('00:00');

  const { options } = useTimezoneSelect({
    labelStyle: 'original',
  });

  const currentUserTimezone = useRef<Campaign['timezone'] | null>(null);

  const [
    startDateWatch,
    endDateWatch,
    timezoneWatch,
    objectiveWatch,
    statusWatch,
  ] = watch(['startDate', 'endDate', 'timezone', 'objective', 'status']);

  useEffect(() => {
    if (!currentUserTimezone.current) {
      return;
    }
    if (!startDateString || !startTimeString) {
      const currentUserTimezoneOffset =
        currentUserTimezone.current?.offset ?? 0;
      const offsetMath = selectedTzOffset - currentUserTimezoneOffset;

      const campaignStart = startDateWatch;
      const startWithOffset = addHours(
        campaignStart,
        -(currentUserTimezone.current?.offset ?? 0),
      );
      const startWithOffset2 = addHours(startWithOffset, -offsetMath);
      setStartDateString(getDateString(startWithOffset2));
      setStartTimeString(getTimeString(startWithOffset2));
    }
  }, [currentUserTimezone.current]);

  useEffect(() => {
    if (!currentUserTimezone.current) {
      return;
    }
    if (!endDateString || !endTimeString) {
      const currentUserTimezoneOffset =
        currentUserTimezone.current?.offset ?? 0;
      const offsetMath = selectedTzOffset - currentUserTimezoneOffset;
      const campaignEnd = endDateWatch;
      const endWithOffset = addHours(
        campaignEnd,
        -(currentUserTimezone.current?.offset ?? 0),
      );
      const endWithOffset2 = addHours(endWithOffset, -offsetMath);
      setEndDateString(getDateString(endWithOffset2));
      setEndTimeString(getTimeString(endWithOffset2));
    }
  }, [currentUserTimezone.current]);

  useEffect(() => {
    if (!currentUserTimezone.current) {
      const offset = new Date().getTimezoneOffset() / 60;
      currentUserTimezone.current =
        (options?.find(
          (option) => option.offset === -offset,
        ) as Campaign['timezone']) ?? null;
    }
  }, [options, timezoneWatch]);

  useEffect(() => {
    if (!timezoneWatch) {
      setValue('timezone', currentUserTimezone?.current ?? defaultTimezone);
    }
  }, [currentUserTimezone.current, timezoneWatch, options]);

  const selectedTzOffset = useMemo(() => {
    return timezoneWatch?.offset ?? 0;
  }, [timezoneWatch]);

  const displayStartDate = useMemo(() => {
    if (!startDateString || !startTimeString) {
      return undefined;
    }
    const currentUserTimezoneOffset = currentUserTimezone.current?.offset ?? 0;
    const displayDate = new Date(
      `${startDateString}T${startTimeString}:00.000Z`,
    );
    return addHours(displayDate, -currentUserTimezoneOffset);
  }, [startDateString, startTimeString, timezoneWatch, currentUserTimezone]);

  const displayEndDate = useMemo(() => {
    if (objectiveWatch === 'retargeting') {
      return displayStartDate && addDays(displayStartDate, 30);
    }
    if (!endDateString || !endTimeString) {
      return undefined;
    }
    const currentUserTimezoneOffset = currentUserTimezone.current?.offset ?? 0;
    const displayDate = new Date(`${endDateString}T${endTimeString}:00.000Z`);
    return addHours(displayDate, -currentUserTimezoneOffset);
  }, [
    endDateString,
    endTimeString,
    timezoneWatch,
    currentUserTimezone,
    objectiveWatch,
    displayStartDate,
  ]);

  const saveStartDate = useMemo(() => {
    if (!startDateString || !startTimeString) {
      return startDateWatch;
    }
    const currentUserTimezoneOffset = currentUserTimezone.current?.offset ?? 0;
    const offsetMath = selectedTzOffset - currentUserTimezoneOffset;
    const saveDate = new Date(`${startDateString}T${startTimeString}:00.000Z`);
    const saveDateWithOffset = addHours(saveDate, currentUserTimezoneOffset);
    const saveDateWithOffset2 = addHours(saveDateWithOffset, offsetMath);
    return saveDateWithOffset2;
  }, [displayStartDate, selectedTzOffset, currentUserTimezone]);

  const saveEndDate = useMemo(() => {
    if (objectiveWatch === 'retargeting') {
      return saveStartDate && addDays(saveStartDate, 30);
    }
    if (!endDateString || !endTimeString) {
      return endDateWatch;
    }
    const currentUserTimezoneOffset = currentUserTimezone.current?.offset ?? 0;
    const offsetMath = selectedTzOffset - currentUserTimezoneOffset;
    const saveDate = new Date(`${endDateString}T${endTimeString}:00.000Z`);
    const saveDateWithOffset = addHours(saveDate, currentUserTimezoneOffset);
    const saveDateWithOffset2 = addHours(saveDateWithOffset, offsetMath);
    return saveDateWithOffset2;
  }, [displayEndDate, selectedTzOffset, currentUserTimezone]);

  useEffect(() => {
    setValue('startDate', saveStartDate, { shouldValidate: true });
    trigger('endDate');
  }, [saveStartDate]);

  useEffect(() => {
    setValue('endDate', saveEndDate, { shouldValidate: true });
    trigger('startDate');
  }, [saveEndDate]);

  const handleDateChange: (
    field: 'startDate' | 'endDate',
    onChange: (date: Date) => void,
  ) => SelectSingleEventHandler = (field, onChange) => (nextDate) => {
    if (!nextDate) {
      return;
    }
    if (field === 'startDate') {
      setStartDateString(getDateString(nextDate));
      return;
    }
    setEndDateString(getDateString(nextDate));
  };

  const handleTimeChange: (
    field: 'startDate' | 'endDate',
    onChange: (date: Date) => void,
  ) => ChangeEventHandler<HTMLInputElement> = (field, onChange) => (e) => {
    if (field === 'startDate') {
      setStartTimeString(e.target.value);
      return;
    }
    setEndTimeString(e.target.value);
  };

  const handleTimezoneChange: (
    onChange: (tz: Campaign['timezone']) => void,
  ) => (nextTz: string) => void = (onChange) => (nextTz) => {
    onChange(
      (options.find(
        (option) => option.value === nextTz,
      ) as Campaign['timezone']) ?? defaultTimezone,
    );
  };

  return (
    <>
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="ms-2 mt-2 w-full">
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Start date
            </FormLabel>
            <div className="flex flex-wrap gap-4">
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      data-testid="start-date"
                      variant={'outline'}
                      className={cn(
                        'w-full md:w-1/4 justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      disabled={
                        !isClone && statusWatch && statusWatch !== 'draft'
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {displayStartDate ? (
                        format(displayStartDate, 'MM/dd/yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    data-testid="start-date-calendar"
                  >
                    <Calendar
                      mode="single"
                      selected={displayStartDate}
                      onSelect={handleDateChange('startDate', field.onChange)}
                      initialFocus
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormControl>
                <Input
                  className="w-full md:w-1/4"
                  type="time"
                  value={
                    displayStartDate ? format(displayStartDate, 'HH:mm') : ''
                  }
                  onChange={handleTimeChange('startDate', field.onChange)}
                  disabled={!isClone && statusWatch && statusWatch !== 'draft'}
                />
              </FormControl>
              <FormField
                control={control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/3">
                    <FormControl>
                      <Select
                        onValueChange={handleTimezoneChange(field.onChange)}
                        value={timezoneWatch?.value}
                        disabled={
                          !isClone && statusWatch && statusWatch !== 'draft'
                        }
                      >
                        <FormControl>
                          <SelectTrigger data-testid="timezone-trigger">
                            <SelectValue placeholder="Select a Timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options?.map((timezone) => (
                            <SelectItem
                              key={timezone.value}
                              value={`${timezone.value}`}
                            >
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
            {!isClone && statusWatch && statusWatch !== 'draft' && (
              <span className="text-sm text-muted-foreground">
                Your campaign has been activated. Start date cannot be changed
                once activated.
              </span>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="ms-2 mt-2 w-full">
            <FormLabel className="text-sm font-normal text-muted-foreground">
              End date
            </FormLabel>
            <div className="flex flex-wrap gap-4">
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      data-testid="end-date"
                      variant={'outline'}
                      className={cn(
                        'w-full md:w-1/4 justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      disabled={objectiveWatch === 'retargeting'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {displayEndDate ? (
                        format(displayEndDate, 'MM/dd/yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    data-testid="end-date-calendar"
                  >
                    <Calendar
                      mode="single"
                      selected={displayEndDate}
                      onSelect={handleDateChange('endDate', field.onChange)}
                      initialFocus
                      disabled={{ before: startDateWatch }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormControl>
                <Input
                  className="w-full md:w-1/4"
                  type="time"
                  value={displayEndDate && format(displayEndDate, 'HH:mm')}
                  onChange={handleTimeChange('endDate', field.onChange)}
                  disabled={objectiveWatch === 'retargeting'}
                />
              </FormControl>
            </div>
            <FormMessage />
            {objectiveWatch === 'retargeting' && (
              <span className="text-sm text-muted-foreground">
                End date is automatically set to 30 days from the start date for
                retargeting campaigns.
              </span>
            )}
          </FormItem>
        )}
      />
    </>
  );
}
