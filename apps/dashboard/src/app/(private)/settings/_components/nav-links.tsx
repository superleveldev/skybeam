'use client';

import { LucideIcon } from 'lucide-react';
import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import Link from 'next/link';
import { cn } from '@limelight/shared-utils/classnames/cn';
import Image, { StaticImageData } from 'next/image';

export function NavLinks({
  links,
  className,
  onClick,
}: {
  links: {
    title: string;
    url?: string;
    label?: string;
    image?: StaticImageData;
    icon?: LucideIcon | FC;
    variant: 'default' | 'ghost';
    isActive?: boolean;
    hidden?: boolean;
  }[];
  className?: string;
  onClick?: () => void;
}) {
  return (
    <>
      {links
        .filter((item) => !item.hidden)
        ?.map((link, index) => {
          return (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    key={index}
                    className={cn(
                      'group shrink-0 flex flex-row gap-2.5 items-center justify-items-start px-2.5 py-2 rounded-lg focus:bg-blue-900 hover:bg-transparent hover:text-sky-600 focus:bg-500/10  transition-colors',
                      {
                        'bg-sky-500/10 text-sky-700 pointer-events-none':
                          link.isActive,
                      },
                      className,
                    )}
                    href={link.url ?? ''}
                    onClick={onClick}
                  >
                    <span className="w-6 h-6 flex items-center justify-center">
                      {link.image && (
                        <Image
                          src={link.image}
                          className={'h-4 w-4 rounded-full'}
                          alt={link.title}
                        />
                      )}
                      {!link.image && link.icon && (
                        <link.icon className="size-4 text-gray-500 font-bold" />
                      )}
                    </span>
                    <span className="font-normal text-sm hidden md:block">
                      {link.title}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={'flex items-center gap-4 md:hidden'}
                >
                  {link.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
    </>
  );
}
