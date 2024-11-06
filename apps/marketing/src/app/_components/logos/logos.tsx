import Image from 'next/image';

import { cn } from '@limelight/shared-utils/classnames/cn';

import styles from './logos.module.css';

export const Logos = () => {
  return (
    <div
      className={cn(
        styles.container,
        'flex flex-col py-20 items-center gap-y-4 bg-[#FAF9F6]',
      )}
    >
      <h2 className={styles.title}>Chosen by</h2>
      <div
        className={cn(
          styles.logosContainer,
          'flex gap-8 justify-center flex-wrap max-w-[71rem] w-full',
        )}
      >
        <div className={styles.imageContainer}>
          <Image
            className={styles.beyondMeatLogo}
            src="/beyond-meat-logo.png"
            alt="Beyond Meat"
            width={3000}
            height={2000}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            className={styles.monsterLogo}
            src="/monster-logo.png"
            alt="Monster"
            width={1280}
            height={209}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            className={styles.mvcLogo}
            src="/mvc-logo.jpeg"
            alt="Metro Vein Centers"
            width={1869}
            height={985}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            className={styles.sfbfLogo}
            src="/sfbf-logo.jpeg"
            alt="San Francisco Bay Ferry"
            width={600}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};
