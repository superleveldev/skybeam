export const Heading = () => {
  return (
    <div
      data-section="pricing-heading-section"
      className="bg-no-repeat bg-center bg-cover bg-[url('/bg-beams-dark.png')] flex justify-center pt-32 pb-52 px-4 tablet:pt-48 tablet:pr-10 tablet:pb-56 tablet:pl-6 laptop:pt-64 laptop:pb-52 laptop:px-10 desktop:px-[152px] bg-[#FAF9F6]"
    >
      <div className="flex flex-col gap-y-4 w-full max-w-full tablet:max-w-[504px] laptop:gap-y-6 laptop:max-w-[880px] desktop:max-w-[71rem]">
        <h1 className="text-[2.875rem] font-light leading-none text-white tablet:text-[4rem] laptop:text-[6.25rem]">
          Pricing
        </h1>
        <p className="text-[14px] text-white leading-normal tablet:text-base laptop:text-lg">
          Television Advertising Simplified: Maximum Reach, Minimum Barriers
        </p>
      </div>
    </div>
  );
};
