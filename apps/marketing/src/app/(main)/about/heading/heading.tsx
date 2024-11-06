import Image from 'next/image';

export const Heading = () => {
  return (
    <div className="flex justify-center pt-28 pb-20 px-6 bg-[#0067FF] overflow-hidden tablet:pt-36 tablet:pb-16 laptop:pt-40 laptop:pb-24 desktop:pt-44 desktop:pb-32">
      <div className="flex flex-col gap-8 text-white max-w-full w-full relative tablet:max-w-[469px] laptop:gap-y-16 laptop:max-w-[880px] desktop:gap-y-14 desktop:max-w-[71rem]">
        <h1
          data-test-main-title
          className="text-[3.125rem] font-light tablet:text-[5rem] tablet:max-w-[430px] laptop:text-[6.25rem] laptop:max-w-[766px]"
        >
          Reach More with Skybeam
        </h1>
        <div className="flex flex-col gap-y-8 laptop:flex-row-reverse">
          <div className="flex flex-col gap-y-4 tablet:max-w-[424px] laptop:max-w-[431px] desktop:gap-y-8 desktop:max-w-[655px]">
            <p
              data-test-introduction-info
              className="text-base z-[1] leading-none tablet:text-[2rem]"
            >
              At Skybeam, we're leveling the playing field in TV advertising.
              We've built a platform that makes connected TV advertising simple,
              fast.
            </p>
            <p className="text-[0.875rem] tablet:text-lg">
              We understand the unique challenges you face – limited budgets,
              lean teams, and the need for quick, measurable results. That's why
              our solution is designed to help you supercharge your existing
              marketing efforts in search & social without the traditional
              complexities of TV advertising.
            </p>
          </div>
          <div className="relative h-[179px] tablet:h-[276px] w-full">
            <Image
              data-test-image-banner
              className="absolute z-0 rotate-[-6deg] max-w-[616px] w-[198%] top-[0] right-0 tablet:right-[82px] tablet:top-0 tablet:w-[143%] tablet:max-w-[702px] tablet:rotate-0 laptop:rotate-[-7deg] laptop:top-[78px] laptop:right-0 laptop:max-w-[808px] laptop:w-[808px]"
              src="/light-beam.png"
              alt="Light Beam"
              width={2116}
              height={1186}
            />
          </div>
        </div>
        <div className="flex flex-col z-[1] gap-x-6 desktop:flex-row desktop:pt-60">
          <div className="flex flex-col gap-y-4 pb-20 tablet:pb-40 tablet:gap-y-8 laptop:max-w-[540px] desktop:max-w-[464px]">
            <h3 className="font-light">
              We believe in the transformative power of TV ads for businesses of
              all sizes
            </h3>
            <p className="text-[0.875rem] tablet:text-lg">
              Whether you're looking to expand your reach, boost brand
              awareness, or complement your digital strategies, we're here to
              help you unlock new growth opportunities without breaking the
              bank.
            </p>
          </div>
          <div className="relative w-full h-[382px] tablet:h-[627px] desktop:mt-[-78px]">
            <Image
              className="absolute max-w-[91px] z-[1] top-[-45px] left-[82px] tablet:max-w-[150px] tablet:left-[110px] tablet:top-[-76px] laptop:top-[31%] laptop:left-[unset] laptop:right-[83px] desktop:right-0"
              src="/return-ad-spend.png"
              alt="Return Ad Spend"
              width={873}
              height={724}
            />
            <Image
              className="absolute max-w-[572px] w-[124%] left-[-27px] tablet:max-w-[568px] tablet:left-1/2 tablet:-translate-x-[calc(42%+45px)]"
              src="/about-us-hero-image.png"
              alt="Hero Image"
              width={1144}
              height={1130}
            />
            <Image
              className="absolute z-[1] max-w-[164px] bottom-[24px] right-[10px] tablet:max-w-[268px] laptop:right-[unset] laptop:bottom-[66px] laptop:left-[86px] desktop:bottom-0 desktop:left-0"
              src="/first-campaign.png"
              alt="First Campaign"
              width={1854}
              height={980}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
