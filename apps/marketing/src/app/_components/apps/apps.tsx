import React from 'react';
import Image from 'next/image';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { ReactComponent as ParamountLogo } from '../../../../public/paramount-logo.svg';
import { ReactComponent as SlingLogo } from '../../../../public/sling-logo.svg';
import { ReactComponent as MaxLogo } from '../../../../public/max-logo.svg';
import { ReactComponent as HuluLogo } from '../../../../public/hulu-logo.svg';

import styles from './apps.module.css';

export const Apps: React.FC = () => {
  return (
    <div
      id="apps"
      data-section="apps-section"
      className={cn(
        styles.appsContainer,
        'flex flex-col pt-20 px-[9.5rem] gap-y-20 items-center',
      )}
    >
      <h2 data-test-advertise-on className={styles.appsTitle}>
        Advertise on
      </h2>
      <div
        className={cn(
          styles.appsLogoContainer,
          'max-w-[71rem] w-full p-[30px] bg-[#010E0F] border-x-[10px] border-t-[10px] border-[#333] rounded-t-[10px]',
        )}
      >
        <div
          data-test-img-section
          className={cn(styles.appsLogo, styles.appsRoku, 'p-9')}
        >
          <Image src="/roku-logo.png" alt="Roku" width={1597} height={473} />
        </div>
        <div className={cn(styles.appsLogo, styles.appsParamount)}>
          <ParamountLogo />
        </div>
        <div
          className={cn(styles.appsLogo, styles.appsDiscovery, 'py-10 px-6')}
        >
          <Image
            src="/discovery-logo.png"
            alt="Discovery+"
            width={995}
            height={200}
          />
        </div>
        <div
          className={cn(
            styles.appsLogo,
            styles.appsPeacock,
            'pt-8 pr-8 pb-8 pl-[22px] bg-white',
          )}
        >
          <Image
            src="/peacock-logo.png"
            alt="Peacock"
            width={667}
            height={215}
          />
        </div>
        <div className={cn(styles.appsLogo, 'overflow-hidden')}>
          <Image src="/tubi-logo.png" alt="Tubi" width={1422} height={800} />
        </div>
        <div className={cn(styles.appsLogo, styles.appsSling)}>
          <SlingLogo />
        </div>
        <div className={cn(styles.appsLogo, styles.appsMax)}>
          <MaxLogo />
        </div>
        <div className={cn(styles.appsLogo, styles.appsHulu)}>
          <HuluLogo />
        </div>
      </div>
    </div>
  );
};
