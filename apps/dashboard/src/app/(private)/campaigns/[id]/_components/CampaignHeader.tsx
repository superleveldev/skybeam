'use client';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { CalendarIcon, Info } from 'lucide-react';
import { CampaignProgress } from './CampaignProgress';
import { addHours, endOfDay, format } from 'date-fns';
import { Calendar } from '@limelight/shared-ui-kit/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@limelight/shared-ui-kit/ui/popover';
import { cn } from '@limelight/shared-utils/index';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { useRouter } from 'next/navigation';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { useEffect, useRef, useState } from 'react';
import { Campaign } from '../../types';
import StatusBadge from '../../_components/StatusBadge';

function isValidDateString(dateString?: string | null): dateString is string {
  if (!dateString) {
    return false;
  }
  return z.string().date().safeParse(dateString).success;
}

export default function CampaignHeader({ campaign }: { campaign: Campaign }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const openSearchParams = new URLSearchParams(searchParams.toString());

  openSearchParams.set('details', 'true');
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const currentUserOffset = useRef(new Date().getTimezoneOffset() / 60);

  useEffect(() => {
    if (range.from && range.to) {
      return;
    }

    let startDate = campaign?.startDate;
    let endDate = campaign?.endDate;

    if (searchParams.has('startDate')) {
      const dateString = searchParams.get('startDate');
      if (isValidDateString(dateString)) {
        startDate = endOfDay(new Date(dateString));
      }
    }

    if (searchParams.has('endDate')) {
      const dateString = searchParams.get('endDate');
      if (isValidDateString(dateString)) {
        endDate = endOfDay(new Date(dateString));
      }
    }

    setRange({
      from:
        startDate &&
        addHours(
          toZonedTime(
            fromZonedTime(startDate, campaign?.timezone?.value ?? 'UTC'),
            campaign?.timezone?.value ?? 'UTC',
          ),
          currentUserOffset.current,
        ),
      to:
        endDate &&
        addHours(
          toZonedTime(
            fromZonedTime(endDate, campaign?.timezone?.value ?? 'UTC'),
            campaign?.timezone?.value ?? 'UTC',
          ),
          currentUserOffset.current,
        ),
    });
  }, [searchParams]);

  const handleDateRangeSelection: SelectRangeEventHandler = (
    currentDateRange: DateRange | undefined,
    nextDate: Date,
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (range.from && range.to) {
      setRange({ from: nextDate, to: undefined });
      return;
    }

    if (!range.from) {
      return;
    }

    nextSearchParams.set('startDate', range.from.toISOString().split('T')[0]);
    nextSearchParams.set('endDate', nextDate.toISOString().split('T')[0]);
    router.push(`${pathname}?${nextSearchParams.toString()}`);
  };

  if (!campaign) {
    return null;
  }

  return (
    <header className="w-full px-12 flex justify-between items-center flex-wrap-reverse gap-4">
      <div className="flex justify-start items-center gap-2 max-w-full ">
        <CampaignProgress
          startDate={campaign.startDate}
          endDate={campaign.endDate}
        />
        <div className="flex-col justify-center items-center max-w-[70%] md:max-w-full gap-2">
          <div className="flex justify-start items-center">
            <h2 className="text-2xl md:text-3xl font-bold truncate max-w-fit ">
              {campaign?.name}
            </h2>

            <Link
              className="btn btn-ghost"
              href={`${pathname}?${openSearchParams.toString()}`}
            >
              <Info className="size-6" />
            </Link>
          </div>
          {/* TODO: Handle submitted vs. live vs. finished vs. draft*/}
          <div className="flex justify-start items-center gap-2">
            <StatusBadge status={campaign.status} />
            <span>
              {formatInTimeZone(
                campaign.startDate,
                campaign.timezone.value,
                'MM/dd/yyyy HH:mm a',
              )}{' '}
              -{' '}
              {formatInTimeZone(
                campaign.endDate,
                campaign.timezone.value,
                'MM/dd/yyyy HH:mm a',
              )}
              , {campaign?.timezone?.abbrev}
            </span>
          </div>
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full md:w-fit justify-start text-left font-normal',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              format(range.from, 'PP')
            ) : (
              <span className="w-36" />
            )}{' '}
            - {range?.to ? format(range.to, 'PP') : <span className="w-36" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          data-testid="start-date-calendar"
        >
          <Calendar
            selected={range}
            mode="range"
            disabled={{ before: campaign.startDate, after: campaign.endDate }}
            onSelect={handleDateRangeSelection}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </header>
  );
}
