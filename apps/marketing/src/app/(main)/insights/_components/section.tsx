import { cn } from '@limelight/shared-utils/classnames/cn';
import { ReactNode } from 'react';

export default function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      data-section="insights-section"
      className="pt-[52px] tablet:pt-[70px] bg-[#FAF9F6] min-w-[320px]"
    >
      <div className='w-full h-[425px] tablet:h-[532px] laptop:h-[623px] desktop:h-[523px] relative bg-no-repeat bg-[url("/insights_background_1440-.png")] desktop:bg-[url("/insights_background_1440+.png")] laptop:bg-center laptop:bg-cover' />
      <div className={cn('w-full flex justify-center', className)}>
        {children}
      </div>
    </section>
  );
}
