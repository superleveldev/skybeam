import { ReactNode } from 'react';

export default function RangeTitle({ children }: { children: ReactNode }) {
  return (
    <p className="underline decoration-dotted underline-offset-2 cursor-help text-center text-[0.875rem] ">
      {children}
    </p>
  );
}
