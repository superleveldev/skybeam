import Image from 'next/image';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { ReactComponent as SimulmediaTextLogo } from '../../../../public/simulmedia-logo.svg';
import { ReactComponent as SimulmediaCroppedMirroredLogo } from '../../../../public/sm-logo-cropped-mirrored.svg';
import { ReactComponent as SimulmediaCroppedMirroredLaptopLogo } from '../../../../public/sm-logo-cropped-mirrored-laptop.svg';
import { ReactComponent as SimulmediaLogo } from '../../../../public/sm-logo.svg';

import styles from './simulmedia.module.css';

export const Simulmedia = () => {
  return (
    <div
      className={cn(
        styles.container,
        'flex justify-center py-24 px-[152px] bg-no-repeat bg-cover bg-[url("/simulmedia-bg-small.png")] desktop:bg-[url("/simulmedia-bg.png")] desktop:bg-[position:50%]',
      )}
    >
      <div
        className={cn(
          styles.content,
          'px-[56px] pt-[72px] pb-[56px] rounded-3xl flex flex-col gap-y-14 relative z-[1] max-w-[71rem] w-full',
        )}
      >
        <div
          className={cn(
            styles.textContainer,
            'flex flex-col gap-y-[30px] max-w-[590px]',
          )}
        >
          <div
            className={cn(
              styles.smLogoContainer,
              'flex justify-center items-center py-[32px] laptop:hidden',
            )}
          >
            <SimulmediaLogo />
          </div>
          <div className="flex flex-col desktop:gap-y-2">
            <p className={styles.title}>Powered by</p>
            <SimulmediaTextLogo className={styles.simulmediaTextLogo} />
          </div>
          <p data-test-simulmedia-section className={styles.text}>
            Skybeam harnesses the expertise of Simulmedia, a trailblazer in TV
            advertising since 2008. Their TV+® platform, which powers campaigns
            for numerous top brands, combines linear TV and streaming
            capabilities to deliver exceptional results. With Skybeam, you're
            not just getting a new tool; you're accessing years of
            industry-leading expertise and technology, tailored for your needs.
          </p>
        </div>
        <div className="text-center">
          <span className={styles.partnersTitle}>Trusted Partner of:</span>
          <div className="flex gap-6 items-center justify-center flex-wrap">
            <Image
              className={cn(styles.partnerLogo, 'w-16 h-16')}
              src="/abc-logo.png"
              alt="ABC"
              width={87}
              height={87}
            />
            <Image
              className={cn(styles.partnerLogo, 'w-[155px] h-[18px]')}
              src="/frigidaire-logo.png"
              alt="Frigidaire"
              width={338}
              height={40}
            />
            <Image
              className={cn(styles.partnerLogo, 'w-[171px] h-12')}
              src="/kings-hawaiian-logo.png"
              alt="King's Hawaiian"
              width={342}
              height={96}
            />
            <Image
              className={cn(styles.partnerLogo, 'w-[128px] h-10')}
              src="/experian-logo.png"
              alt="Experian"
              width={257}
              height={80}
            />
            <Image
              className={cn(styles.partnerLogo, 'w-[146px] h-[38px]')}
              src="/choice-logo.png"
              alt="Choice Hotels"
              width={292}
              height={75}
            />
            <Image
              className={cn(styles.partnerLogo, 'w-[161px] h-10')}
              src="/wayfair-logo.png"
              alt="Wayfair"
              width={323}
              height={80}
            />
          </div>
        </div>
        <SimulmediaCroppedMirroredLogo className="absolute right-0 top-0 hidden desktop:block" />
        <SimulmediaCroppedMirroredLaptopLogo className="absolute right-0 top-0 hidden laptop:block desktop:hidden" />
      </div>
    </div>
  );
};
