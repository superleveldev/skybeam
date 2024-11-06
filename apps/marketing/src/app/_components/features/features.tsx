import React from 'react';
import Image from 'next/image';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { FeaturesCard } from './features-card';
import { ReactComponent as BullseyeSVG } from '../../../../public/bullseye.svg';
import { ReactComponent as ZapSVG } from '../../../../public/zap-fast.svg';
import { ReactComponent as MapPinSVG } from '../../../../public/map-pin.svg';
import { ReactComponent as HorizontalBarChartSVG } from '../../../../public/horizontal-bar-chart.svg';

import styles from './features.module.css';

export const Features: React.FC = () => {
  return (
    <div
      id="features"
      data-section="features-section"
      className={cn(
        styles.featuresContainer,
        'flex flex-col items-center py-36 px-[9.5rem] gap-y-16',
      )}
    >
      <h2 data-test-second-subtitle className={styles.featuresTitle}>
        Turn TV into Your Next{' '}
        <span className="text-[#0056ED]">Performance Powerhouse</span>
      </h2>
      <div
        className={cn(
          styles.featureCardsContainer,
          'flex flex-col gap-y-4 max-w-[71rem] w-full',
        )}
      >
        <div className={cn(styles.featuresCardContainer, 'flex gap-x-4')}>
          <FeaturesCard
            title={<h4>Target the Right Audience with Precision</h4>}
            subtitle="Access 250+ advanced targeting options including demographics, interests, and behaviors to ensure your ads reach the right viewers"
            widthStyle="w-[654px]"
            img={
              <div
                className={cn(
                  styles.featuresCardImage,
                  'flex justify-center items-center w-[446px] pb-[3.25rem]',
                )}
              >
                <Image
                  width={1517}
                  height={844}
                  src="/audience-overlap.png"
                  alt="Audience Overlap"
                />
              </div>
            }
            icon={
              <div
                className={cn('hidden tablet:block', styles.featuresCardIcon)}
              >
                <BullseyeSVG />
              </div>
            }
          />
          <FeaturesCard
            title={
              <h4>
                Plan Smarter,
                <br /> Perform Better
              </h4>
            }
            subtitle="Predict outcomes, optimize key metrics, and plan TV campaigns with confidence before you invest"
            widthStyle="w-[39%]"
            img={
              <div
                className={cn(
                  styles.featuresCardImage,
                  'flex justify-center items-center w-[285px] pb-[1.4rem]',
                )}
              >
                <Image
                  width={873}
                  height={724}
                  src="/budget-calculator.png"
                  alt="Budget Calculator"
                />
              </div>
            }
            icon={
              <div
                className={cn('hidden tablet:block', styles.featuresCardIcon)}
              >
                <ZapSVG className="[&>path]:stroke-[1.5]" />
              </div>
            }
          />
        </div>
        <div className={cn(styles.featuresCardContainer, 'flex gap-x-4')}>
          <FeaturesCard
            title={<h4>Go National or Local with Ease</h4>}
            subtitle="Target nationwide or focus on specific zip codes/metro areas giving you the power to match any client's geographical needs"
            widthStyle="w-[39%]"
            img={
              <div
                className={cn(
                  styles.featuresCardImage,
                  'flex justify-center items-center w-[260px] pb-10',
                )}
              >
                <Image
                  width={874}
                  height={724}
                  src="/geotargeting.png"
                  alt="Geotargeting"
                />
              </div>
            }
            icon={
              <div
                className={cn('hidden tablet:block', styles.featuresCardIcon)}
              >
                <MapPinSVG />
              </div>
            }
          />
          <FeaturesCard
            title={<h4>Measure Campaign Success</h4>}
            subtitle="Track real-time, detailed reporting to continuously optimize campaign performance and demonstrate ROAS"
            widthStyle="w-[654px]"
            img={
              <div
                className={cn(
                  styles.featuresCardImage,
                  'flex justify-center items-center w-[462px] pb-[1.4rem]',
                )}
              >
                <Image
                  width={3034}
                  height={1688}
                  src="/impressions.png"
                  alt="Impressions"
                />
              </div>
            }
            icon={
              <div
                className={cn('hidden tablet:block', styles.featuresCardIcon)}
              >
                <HorizontalBarChartSVG />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
