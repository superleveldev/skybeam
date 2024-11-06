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
        'flex flex-col justify-center px-4 pt-4 tablet:pt-8 laptop:pt-16 tablet:px-6 laptop:px-10 desktop:px-[152px]',
        className,
      )}
    >
      {children}
    </section>
  );
}
