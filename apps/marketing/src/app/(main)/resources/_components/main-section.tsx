import Image from 'next/image';

type MainSectionProps = {
  alt?: string;
  imageUrl?: string;
  subtitle?: string;
  title: string;
};

export default async function MainSection({
  alt,
  imageUrl,
  subtitle,
  title,
}: MainSectionProps) {
  return (
    <section
      data-section="resources-section"
      className="flex justify-center bg-black overflow-hidden"
    >
      <div className="w-full max-w-full flex items-start pt-20 px-6 relative h-[562px] tablet:pt-[146px] tablet:max-w-[520px] tablet:h-[858px] laptop:h-[1086px] laptop:pt-[164px] laptop:justify-center laptop:max-w-[880px] desktop:justify-end desktop:pr-[55px] desktop:h-[936px] desktop:max-w-[1440px]">
        <Image
          data-test-title-img
          className="absolute z-0 max-w-[835px] bottom-0 left-1/2 -translate-x-[46%] tablet:left-[unset] tablet:translate-x-0 tablet:max-w-[274%] tablet:bottom-[-33px] tablet:right-[-100%] laptop:max-w-[200%] laptop:bottom-0 laptop:right-[-59%] desktop:max-w-[150%] desktop:top-[-378px] desktop:right-[-180px]"
          src="/resource-hero-image.png"
          alt="Illustration for Resources Section"
          width={2830}
          height={1722}
        />
        <div className="w-full max-w-full text-center flex flex-col gap-y-3 justify-center z-[1] text-white desktop:pl-14 desktop:text-start desktop:gap-y-8 desktop:pt-[178px] desktop:max-w-[559px]">
          <h1
            data-test-main-title
            className="font-light text-[2.875rem] tablet:text-[4.375rem] laptop:text-[6.25rem]"
          >
            {title}
          </h1>
          <p className="text-[0.875rem] tablet:text-[1.25rem]">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
