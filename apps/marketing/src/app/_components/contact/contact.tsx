import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { cn } from '@limelight/shared-utils/classnames/cn';

import styles from './contact.module.css';

interface ContactProps {
  containerStyle?: string;
}

export const Contact: React.FC<ContactProps> = ({
  containerStyle = 'bg-[#F4F6FF]',
}) => {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <div
      data-section="contact-section"
      className={cn(
        styles.contactContainer,
        'flex justify-center py-24 px-[9.5rem]',
        containerStyle,
      )}
    >
      <div
        data-test-call-to-actions-component
        className={cn(
          styles.contactContent,
          'flex flex-col items-center gap-y-10 max-w-[71rem] w-full p-16 bg-[#0067FF] rounded-3xl relative overflow-hidden',
        )}
      >
        <div className="flex flex-col gap-y-5 z-[1]">
          <h2 className={styles.contactTitle}>
            Go Beyond
            <br /> Search and Social
          </h2>
          <p className={styles.contactSubtitle}>
            Boost your marketing with Skybeam TV ads manager!
          </p>
        </div>
        <Link className="z-[1]" href={`${dashboardUrl}/sign-up`}>
          <Button
            data-test-get-started-bottom-btn
            className="marketing-secondary-button py-4 px-11 h-full"
            variant="secondary"
          >
            Get Started
          </Button>
        </Link>
        <Image
          className="absolute max-w-[1042px] right-[-185px] top-[-132px] tablet:max-w-[1010px] tablet:top-[-80px] tablet:right-[-135px] laptop:max-w-[1074px] laptop:top-[-24px] laptop:right-[-148px] desktop:max-w-full desktop:right-[-75px] desktop:top-[52px]"
          src="/light-beam.png"
          width={2116}
          height={1186}
          alt="Light Beam"
        />
      </div>
    </div>
  );
};
