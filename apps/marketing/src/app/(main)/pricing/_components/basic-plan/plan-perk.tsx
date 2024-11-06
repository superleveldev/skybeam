import React from 'react';
import { ReactComponent as CheckIcon } from '../../../../../../public/check-circle-blue.svg';

interface PlanPerkProps {
  value: string;
  isComingSoon: boolean;
}

export const PlanPerk: React.FC<PlanPerkProps> = ({ value, isComingSoon }) => {
  return (
    <div className="flex gap-x-3">
      <CheckIcon className="min-w-6" />
      <p className="text-[14px] leading-normal tablet:text-base">
        {value}
        {isComingSoon && <i> (coming soon)</i>}
      </p>
    </div>
  );
};
