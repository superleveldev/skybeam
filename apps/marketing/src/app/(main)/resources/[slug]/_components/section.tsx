import { cn } from '@limelight/shared-utils/classnames/cn';

export default async function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex flex-col justify-center laptop:pt-40 tablet:pt-28 pt-16 px-4 tablet:px-6 laptop:px-10 desktop:px-[152px]',
        className,
      )}
    >
      {children}
    </section>
  );
}
