import { MeetingsScheduler } from './meetings-scheduler';

export const Schedule = () => {
  return (
    <div className="bg-white pt-14 pb-12 px-4 flex justify-center tablet:pt-24 tablet:pb-[4.5rem] desktop:pt-36">
      <div className="w-full max-w-full flex flex-col items-center gap-y-2 tablet:max-w-[488px] laptop:max-w-[880px] laptop:gap-y-8 desktop:max-w-[71rem]">
        <div className="flex flex-col items-center gap-y-4 w-64 text-center tablet:gap-y-5 tablet:w-full">
          <h3 className="text-[#00152A] font-light desktop:text-[5rem]">
            Chat With Us
          </h3>
          <p className="text-base text-[#737C8B] tablet:text-lg laptop:text-[1.25rem] laptop:leading-normal">
            Need help with Skybeam? Our team is ready to assist you. Start a
            conversation now to get quick answers and expert guidance
          </p>
        </div>
        <MeetingsScheduler />
      </div>
    </div>
  );
};
