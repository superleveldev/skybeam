'use client';

import * as React from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@limelight/shared-ui-kit/ui/sheet';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { Menu } from 'lucide-react';
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import CampaignListButton from './CampaignListButton';

function ActiveLink(props: React.ComponentPropsWithRef<typeof Link>) {
  const { className, href } = props;
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const textColor = isActive
    ? 'text-white font-strong bg-gray-700 px-4 rounded-full'
    : 'text-white font-strong px-4 hover:bg-gray-700 hover:rounded-full';
  if (href === '/campaigns' || href === '/') {
    return (
      <CampaignListButton className={clsx(textColor, className)}>
        Campaigns
      </CampaignListButton>
    );
  }
  return <Link {...props} className={clsx(textColor, className)} />;
}

export default function MainNav() {
  return (
    <header className="sticky z-10 top-0 mb-10 flex h-20 items-center justify-between gap-4 border-b bg-gray-800 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <CampaignListButton className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Image
            alt="Skybeam"
            src="/skybeam_logo_dark.svg"
            width={127}
            height={31}
            className="mb-2"
          />
          <span className="sr-only">Limelight</span>
        </CampaignListButton>
        <SignedIn>
          <ActiveLink href="/campaigns" className="transition-colors ">
            Campaigns
          </ActiveLink>
        </SignedIn>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-gray-800 text-white"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-800">
          <nav className="grid gap-6 text-lg font-medium bg-gray-800">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Image
                alt="Skybeam"
                src="/skybeam_logo_dark.svg"
                width={127}
                height={31}
                className="mb-2"
              />
              <span className="sr-only">Limelight</span>
            </Link>
            <SignedIn>
              <ActiveLink href="/campaigns" className="transition-colors ">
                Campaigns
              </ActiveLink>
            </SignedIn>
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="flex items-center gap-6 text-sm  font-medium">
        <SignedOut>
          <ActiveLink href="/sign-in" className="transition-colors">
            Sign in
          </ActiveLink>
          <ActiveLink href="/sign-up" className="transition-colors">
            Sign up
          </ActiveLink>
        </SignedOut>
        <SignedIn>
          <OrganizationSwitcher
            hidePersonal
            organizationProfileMode="navigation"
            organizationProfileUrl="/settings/users"
            afterCreateOrganizationUrl={'/campaigns'}
            afterSelectOrganizationUrl={'/campaigns'}
            hideSlug
            appearance={{
              layout: {
                unsafe_disableDevelopmentModeWarnings: true,
              },
              elements: {
                organizationSwitcherTrigger:
                  'text-white font-medium active:text-white focus:text-white hover:text-white hover:bg-gray-700 px-4 rounded-full',
              },
            }}
            organizationProfileProps={{
              appearance: {
                layout: { unsafe_disableDevelopmentModeWarnings: true },
              },
            }}
          />
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/settings/general"
            appearance={{
              layout: { unsafe_disableDevelopmentModeWarnings: true },
            }}
          />
        </SignedIn>
      </nav>
    </header>
  );
}
