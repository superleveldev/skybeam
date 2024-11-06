import { ChevronLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function NewTargetingGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="top-20 -mt-10 mb-10 flex h-10 w-full items-center justify-evenly gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex w-[33%] items-center justify-start gap-2 text-sm font-medium">
          <Link href="/campaigns">
            <ChevronLeft className="size-4" />
          </Link>
          <span>Campaigns</span>
        </div>
        <div className="flex w-[33%] items-center justify-center text-sm font-medium">
          <h1 className="text-sm">New Targeting Group</h1>
        </div>
        <div className="flex w-[33%] items-center justify-end text-sm font-medium">
          <Link href="/campaigns">
            <X className="size-4" />
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
