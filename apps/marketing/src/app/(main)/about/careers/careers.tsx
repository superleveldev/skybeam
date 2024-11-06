import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@limelight/shared-ui-kit/ui/button';

import { ReactComponent as UsersIcon } from '../../../../../public/users.svg';

export const Careers = () => {
  return (
    <div
      data-section="careers-section"
      className="bg-[#0067FF] pt-24 pb-20 px-10 flex justify-center"
    >
      <div className="w-full max-w-full flex flex-col gap-y-4 tablet:max-w-[488px] laptop:max-w-[880px] laptop:flex-row laptop:gap-x-4 desktop:max-w-[71rem]">
        <div className="flex flex-col gap-y-4 tablet:gap-y-6 laptop:w-1/2">
          <div className="bg-[#0083FF] rounded p-2.5 w-10 h-10 flex items-center justify-center tablet:w-12 tablet:h-12">
            <UsersIcon className="[&>g>path]:stroke-white tablet:w-6 tablet:h-6" />
          </div>
          <h3 className="text-white font-light tablet:tracking-[-0.5px] laptop:text-[3.125rem]">
            We're looking for talented people
          </h3>
          <p className="text-white text-[0.875rem] leading-normal tablet:text-[1.125rem]">
            Skybeam is growing fast, and we are always looking for passionate,
            dynamic, and talented individuals to join our distributed team all
            around the world.
          </p>
          <div className="flex justify-between items-center laptop:flex-col laptop:items-start laptop:gap-y-8">
            <Button
              className="marketing-secondary-button w-full h-10 tablet:h-11 tablet:w-48"
              variant="secondary"
            >
              <Link href="https://www.simulmedia.com/careers#lever-jobs-container">
                <p className="text-[1rem] font-semibold">View Open Positions</p>
              </Link>
            </Button>
          </div>
        </div>
        <div className="pt-4 laptop:w-1/2">
          <Image
            className="rounded-lg laptop:object-cover laptop:w-[432px] laptop:h-[432px] desktop:w-[560px] desktop:h-[425px]"
            src="/about-careers.jpeg"
            alt="Careers image"
            width={4096}
            height={2731}
          />
        </div>
      </div>
    </div>
  );
};
