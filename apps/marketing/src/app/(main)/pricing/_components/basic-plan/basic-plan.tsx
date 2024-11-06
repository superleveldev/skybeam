import Link from 'next/link';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { PlanPerk } from './plan-perk';
import { ReactComponent as TrendUpIcon } from '../../../../../../public/trend-up.svg';

const basicPlanData = [
  {
    label: 'Targeting',
    perks: [
      {
        value: 'Demographic & Household Targeting',
        isComingSoon: false,
      },
      {
        value: 'Lifestyle, Interests, and Hobbies Targeting',
        isComingSoon: false,
      },
      {
        value: 'Professional Occupation Targeting',
        isComingSoon: false,
      },
      {
        value: 'State, Metro, Zip Code level Targeting',
        isComingSoon: false,
      },
      {
        value: 'Day, Hour, and Daypart Targeting',
        isComingSoon: false,
      },
      {
        value: 'Retargeting',
        isComingSoon: false,
      },
      {
        value: 'Audience Sizing & Deliverability Forecasting',
        isComingSoon: true,
      },
      {
        value: 'Automated Performance Optimization',
        isComingSoon: true,
      },
    ],
  },
  {
    label: 'Creatives',
    perks: [
      {
        value: 'Hosting',
        isComingSoon: false,
      },
      {
        value: 'Publishers Approval Process',
        isComingSoon: false,
      },
    ],
  },
  {
    label: 'Reporting',
    perks: [
      {
        value: 'Granular Delivery Reporting',
        isComingSoon: false,
      },
      {
        value: 'Performance Measurement',
        isComingSoon: false,
      },
      {
        value: 'Tracking via Web Pixel',
        isComingSoon: false,
      },
      {
        value: 'Show Level Reporting',
        isComingSoon: true,
      },
    ],
  },
  {
    label: 'Insights',
    perks: [
      {
        value: 'TV Impact Forecaster',
        isComingSoon: false,
      },
    ],
  },
  {
    label: 'Content',
    perks: [
      {
        value: 'Premium Streaming Apps',
        isComingSoon: false,
      },
      {
        value: 'TV Everywhere Apps',
        isComingSoon: false,
      },
    ],
  },
  {
    label: 'Support',
    perks: [
      {
        value: '24/7 Support',
        isComingSoon: false,
      },
      {
        value: 'Credit Card and ACH Transfer Payment',
        isComingSoon: false,
      },
    ],
  },
];

export const BasicPlan = () => {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <div
      data-section="pricing-plan-section"
      className="flex justify-center px-4 "
    >
      <div
        data-test-basic-plan-section
        className="max-w-full w-full pt-4 rounded-[16px] border flex flex-col items-center mt-[-171px] bg-white shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),_0px_12px_16px_-4px_rgba(16,24,40,0.08)] tablet:max-w-[522px] laptop:max-w-[882px] desktop:max-w-[1138px] desktop:gap-y-4"
      >
        <div className="flex flex-col items-center gap-y-4 pt-10 pb-4 px-4">
          <TrendUpIcon className="p-3 w-12 h-12 bg-[#FAFAF5] border border-[#E5E8D6] rounded mb-6" />
          <h3 className="text-[2rem] text-center leading-none font-light text-[#0A0A0A] tablet:text-[3.125rem] laptop:text-6xl">
            Platform Overview
          </h3>
          <p className="text-[1rem] text-center leading-snug text-[#0A0A0A] tablet:text-[1.25rem] tablet:leading-normal">
            All features included with your campaign spend
          </p>
        </div>
        <div className="flex flex-wrap gap-6 w-full p-6 tablet:hidden">
          {basicPlanData.map(({ label, perks }) => (
            <div
              key={label}
              className="w-full flex flex-col gap-y-2 text-[#0A0A0A] tablet:max-w-[224px] tablet:gap-y-4 laptop:max-w-[256px] desktop:max-w-[341px]"
            >
              <p className="text-base leading-snug font-semibold tablet:text-lg">
                {label}
              </p>
              {perks.map(({ value, isComingSoon }) => {
                return (
                  <PlanPerk
                    key={value}
                    value={value}
                    isComingSoon={isComingSoon}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="hidden p-8 gap-x-6 tablet:flex laptop:hidden">
          <div className="flex flex-col gap-y-10">
            {basicPlanData.map(({ label, perks }, index) => {
              if (index > 1) {
                return null;
              }
              return (
                <div className="flex flex-col gap-y-4" key={label}>
                  <p className="text-lg font-semibold text-[#00152A]">
                    {label}
                  </p>
                  {perks.map(({ value, isComingSoon }) => {
                    return (
                      <PlanPerk
                        key={value}
                        value={value}
                        isComingSoon={isComingSoon}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-y-10">
            {basicPlanData.map(({ label, perks }, index) => {
              if (index < 2) {
                return null;
              }
              return (
                <div className="flex flex-col gap-y-4" key={label}>
                  <p className="text-lg font-semibold text-[#00152A]">
                    {label}
                  </p>
                  {perks.map(({ value, isComingSoon }) => {
                    return (
                      <PlanPerk
                        key={value}
                        value={value}
                        isComingSoon={isComingSoon}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="hidden p-8 gap-x-6 laptop:flex">
          <div className="flex flex-col gap-y-10 max-w-[256px] w-full desktop:max-w-[342px]">
            {basicPlanData.map(({ label, perks }, index) => {
              if (index > 0) {
                return null;
              }
              return (
                <div className="flex flex-col gap-y-4" key={label}>
                  <p className="text-lg font-semibold text-[#00152A]">
                    {label}
                  </p>
                  {perks.map(({ value, isComingSoon }) => {
                    return (
                      <PlanPerk
                        key={value}
                        value={value}
                        isComingSoon={isComingSoon}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-y-10 max-w-[256px] w-full desktop:max-w-[342px]">
            {basicPlanData.map(({ label, perks }, index) => {
              if (index < 1 || index > 2) {
                return null;
              }
              return (
                <div className="flex flex-col gap-y-4" key={label}>
                  <p className="text-lg font-semibold text-[#00152A]">
                    {label}
                  </p>
                  {perks.map(({ value, isComingSoon }) => {
                    return (
                      <PlanPerk
                        key={value}
                        value={value}
                        isComingSoon={isComingSoon}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-y-10 max-w-[256px] w-full desktop:max-w-[342px]">
            {basicPlanData.map(({ label, perks }, index) => {
              if (index < 3) {
                return null;
              }
              return (
                <div className="flex flex-col gap-y-4" key={label}>
                  <p className="text-lg font-semibold text-[#00152A]">
                    {label}
                  </p>
                  {perks.map(({ value, isComingSoon }) => {
                    return (
                      <PlanPerk
                        key={value}
                        value={value}
                        isComingSoon={isComingSoon}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full p-4 bg-[#F4F6FF] tablet:p-8">
          <Link href={`${dashboardUrl}/sign-up`}>
            <Button
              data-test-get-started-top-btn
              className="w-full h-[38px] bg-[#0056ED] text-[14px] font-semibold hover:bg-[#497CFF] active:bg-[#004ED6] tablet:text-base tablet:h-11 laptop:h-[62px] laptop:text-[20px]"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
