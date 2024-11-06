import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { Button } from '@limelight/shared-ui-kit/ui/button';

import styles from './heading.module.css';

export const Heading: React.FC = () => {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <div
      data-section="heading-section"
      //TODO: incorporate brand colors using vars into tailwind config
      className={cn(
        styles.headingContainer,
        'w-full overflow-x-hidden flex flex-col',
      )}
    >
      <div
        className={cn(
          styles.heroContainer,
          'flex justify-center pt-[145px] pl-[152px] pb-[84px] relative',
        )}
      >
        <div
          className={cn(
            styles.heroContent,
            'flex flex-col items-start gap-y-12 max-w-[1378px] w-full',
          )}
        >
          <div className="flex flex-col gap-y-6 z-[1] pt-[80px]">
            <h1
              className={cn(
                styles.headingTitle,
                'max-w-[657px] text-left font-light',
              )}
            >
              Supercharge Your Search and Social with TV ads
            </h1>
            <p
              data-test-text-under-title
              className={cn(styles.headingSubtitle, 'max-w-[460px] text-left')}
            >
              Integrate TV into your digital strategy with Skybeam™ TV Ads
              Manager:{' '}
              <strong>
                launch smarter campaigns, gain deeper insights, and amplify your
                results
              </strong>
            </p>
          </div>
          <Link className="z-[1]" href={`${dashboardUrl}/sign-up`}>
            <Button
              data-test-get-started-top-btn
              className="marketing-primary-button py-[16px] px-[44px] h-14 mb-[86px] "
              variant="secondary"
            >
              Get Started
            </Button>
          </Link>
          <Image
            className={cn(
              styles.heroImage,
              'absolute right-[-382px] top-[44%] max-w-[232%] tablet:right-[-478px] tablet:top-[42%] tablet:max-w-[196%] laptop:top-[40%] laptop:max-w-[136%] laptop:right-[-346px] desktop:left-[50%] desktop:top-[-109px] desktop:max-w-[1619px]',
            )}
            src="/hero-image.png"
            priority
            alt="Hero Image Large"
            width={3840}
            height={2977}
          />
        </div>
      </div>
      <div
        data-section="digital-campaigns-section"
        className={cn(
          styles.digitalCampaignsContainer,
          'flex justify-center pt-[96px] relative bg-no-repeat bg-[url("/digital-campaigns-bg-mobile-image.png")] bg-[length:169.014%_103.511%] bg-[position:-196px_0px] laptop:bg-[url("/digital-campaigns-bg-image.png")] laptop:bg-center laptop:bg-cover',
        )}
      >
        <div
          className={cn(
            styles.digitalCampaignsContent,
            'flex flex-col text-center gap-y-8 w-full max-w-[71rem]',
          )}
        >
          <div className="flex flex-col items-center gap-y-[32px]">
            <h2
              data-test-first-subtitle
              className={cn(styles.digitalCampaignsTitle)}
            >
              Your Digital Campaigns,
              <br /> Now Powered by TV
            </h2>
            <p className={styles.digitalCampaignsSubtitle}>
              Build data-driven TV campaigns with precision targeting and
              real-time insights, seamlessly integrated with your digital
              efforts
            </p>
          </div>
          <div
            className={cn(
              styles.headingImagesContainer,
              'flex justify-center relative z-[1]',
            )}
          >
            <Image
              className={cn(
                styles.returnAdSendImage,
                'absolute top-[-58px] right-[-95px] max-w-[219px] max-h-[182px] z-[1] rounded-[11px]',
              )}
              src="/return-ad-spend.png"
              alt="Return Ad Spend"
              width={873}
              height={724}
            />
            <Image
              className={cn(styles.newCampaignImage, 'absolute z-0')}
              src="/new-campaign.png"
              alt="New Campaign"
              width={3590}
              height={2204}
            />
            <Image
              className={cn(
                styles.firstCampaignImage,
                'absolute bottom-[60px] left-[-95px] max-w-[496px] max-h-[252px] z-[1]',
              )}
              src="/first-campaign.png"
              alt="First Campaign"
              width={1854}
              height={980}
            />
            <div className="opacity-20 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)] h-4 w-full absolute bottom-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
