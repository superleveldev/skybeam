import React from 'react';

import { cn } from '@limelight/shared-utils/classnames/cn';

import styles from './features.module.css';

interface FeaturesCardProps {
  title: string | React.ReactElement;
  subtitle: string;
  icon: React.ReactElement;
  img: React.ReactElement;
  widthStyle?: string;
}

export const FeaturesCard: React.FC<FeaturesCardProps> = (props) => {
  const { title, subtitle, img, widthStyle = '', icon } = props;

  return (
    <div
      className={cn(
        styles.featuresCard,
        'flex flex-col items-center px-10 pt-10 bg-[#FAF9F6] rounded-3xl gap-y-11',
        widthStyle,
      )}
    >
      <div
        className={cn(
          styles.featuresCardContent,
          'flex flex-col items-center gap-y-6',
        )}
      >
        {icon}
        <div className="flex flex-col gap-y-6 laptop:items-start desktop:items-center desktop:text-center">
          <div className={styles.featuresCardTitle}>{title}</div>
          <p className={styles.featuresCardSubtitle}>{subtitle}</p>
        </div>
      </div>
      {img}
    </div>
  );
};
