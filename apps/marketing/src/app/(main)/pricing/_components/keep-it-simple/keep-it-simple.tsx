import { ReactComponent as LockIcon } from '../../../../../../public/lock.svg';
import { ReactComponent as DollarIcon } from '../../../../../../public/currency-dollar-circle.svg';
import { ReactComponent as KeyIcon } from '../../../../../../public/key.svg';

const data = [
  {
    icon: <LockIcon className="[&>path]:stroke-[#959881]" />,
    title: 'No Contract Lock-ins',
    text: 'Freedom to use our product on your terms',
  },
  {
    icon: <DollarIcon className="[&>path]:stroke-[#959881]" />,
    title: '$50 Minimum Spend',
    text: 'Start small, scale as you grow',
  },
  {
    icon: <KeyIcon className="[&>path]:stroke-[#959881]" />,
    title: 'No Signup Fees',
    text: 'Begin immediately without upfront costs',
  },
];

export const KeepItSimple = () => {
  return (
    <div className="flex justify-center pt-24 px-4 pb-12 tablet:px-6">
      <div className="w-full flex flex-col gap-y-12 tablet:max-w-[520px] laptop:max-w-[880px] desktop:max-w-[71rem]">
        <div className="flex flex-col text-center gap-y-5 text-[#00152A]">
          <h3
            data-test-middle-title
            className="text-[32px] leading-none font-light tablet:text-[50px] laptop:text-6xl"
          >
            We Keep It Simple
          </h3>
          <p className="text-base tablet:text-lg">
            Focus on your campaign success, not complicated terms
          </p>
        </div>
        <div
          data-test-images
          className="flex flex-wrap gap-x-4 gap-y-2 tablet:gap-y-4 laptop:flex-nowrap"
        >
          {data.map(({ icon, title, text }) => (
            <div
              key={text}
              className="w-full flex flex-col gap-y-4 bg-[#FAFAF5] rounded-3xl p-6 tablet:flex-row tablet:gap-6 tablet:p-10 laptop:flex-col desktop:max-w-[368px]"
            >
              <div className="bg-[#FEFEFD] w-12 h-12 p-3 rounded border border-[#E5E8D6]">
                {icon}
              </div>
              <div className="flex flex-col gap-y-2 text-[#00152A]">
                <p className="text-[22px] leading-tight font-extrabold tablet:text-[24px] tablet:leading-snug laptop:text-[30px]">
                  {title}
                </p>
                <p className="text-base tablet:text-lg">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
