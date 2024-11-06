import { urlFor } from '@limelight/shared-sanity';
import { TeamCard } from './team-card';
import { api } from '../../../../trpc/server';

export const Team = async () => {
  const data = await api.about.getOurTeam.query();

  return (
    <div className="bg-white pt-16 pb-8 px-4 flex justify-center tablet:pt-20 laptop:pt-24 laptop:pb-12 desktop:py-24">
      <div
        data-test-team-section
        className="w-full max-w-full flex flex-col gap-y-6 tablet:max-w-[520px] laptop:max-w-[880px] laptop:gap-y-12 desktop:max-w-[71rem]"
      >
        <h3
          data-test-team-title
          className="text-[#00152A] font-light text-[2rem] leading-none tablet:text-[3.125rem] laptop:text-[4rem] desktop:text-[6.25rem]"
        >
          Our Team
        </h3>
        <div className="grid justify-items-center grid-cols-[repeat(auto-fit,minmax(136px,1fr))] auto-fill gap-4 tablet:grid-cols-[repeat(auto-fit,minmax(252px,1fr))] tablet:gap-y-10 laptop:grid-cols-[repeat(auto-fit,minmax(272px,1fr))]">
          {data?.member?.map(({ name, title, image }) => {
            const imageAsset = image?.asset && urlFor(image?.asset);
            const imageUrl = imageAsset?.url();

            return (
              <TeamCard
                key={name}
                name={name}
                title={title}
                imageSrc={imageUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
