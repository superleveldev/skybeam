import React from 'react';
import Image from 'next/image';

interface TeamCardProps {
  name: string | null;
  title: string | null;
  imageSrc: string | undefined;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  title,
  imageSrc,
}) => {
  return (
    <div className="flex flex-col gap-y-2 w-[136px] tablet:w-[252px] tablet:gap-y-3 laptop:w-[272px] desktop:gap-y-4">
      <Image
        data-test-headshot
        className="rounded-lg border bg-[#EEF2F6] border-[#E3E8EF] w-full h-full max-h-[136px] object-cover tablet:max-h-[252px] laptop:max-h-[272px] "
        src={imageSrc ?? ''}
        alt={name ?? ''}
        width={272}
        height={272}
      />
      <div className="flex flex-col leading-normal laptop:gap-y-1">
        <p
          data-test-person
          className="text-[0.875rem] font-semibold text-[#0A0A0A] tablet:text-[1.125rem] laptop:text-[1.25rem]"
        >
          {name}
        </p>
        <p
          data-test-role
          className="text-[0.875rem] text-[#00152A] tablet:text-base laptop:text-[1.125rem]"
        >
          {title}
        </p>
      </div>
    </div>
  );
};
