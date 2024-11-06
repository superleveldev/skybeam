import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { NavItem } from './nav-item';
import { ReactComponent as Logo } from '../../../../public/skybeam-logo-with-text-blue.svg';

import styles from './navbar.module.css';

interface NavbarMobileProps {
  navbarMode: 'light' | 'dark' | 'white';
  setClose: VoidFunction;
}

const navItems = [
  { link: '/insights', label: 'Insights Hub' },
  { link: '/resources', label: 'Blog' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/about', label: 'About Us' },
];

export const NavbarMobile: React.FC<NavbarMobileProps> = ({
  navbarMode,
  setClose,
}) => {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <>
      <div
        data-test-mobile-navbar
        className={cn(
          styles.navbarMobile,
          'z-[100] flex-col gap-y-[14px] rounded-b-[16px] transition-colors duration-500',
          styles[navbarMode],
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex gap-x-4">
            <X className={styles.closeButton} onClick={setClose} />
            <Link href="/">
              <Logo id="skybeam-logo" className={styles.mobileLogo} />
            </Link>
          </div>
          <div className="hidden tablet:flex justify-center gap-x-2">
            <Link href={`${dashboardUrl}/sign-in`} className={cn(styles.link)}>
              <Button
                variant="link"
                className={`h-9 ${
                  navbarMode === 'dark' ? 'text-white' : 'text-[#00152A]'
                } hover:no-underline`}
              >
                Log In
              </Button>
            </Link>
            <Link href={`${dashboardUrl}/sign-up`}>
              <Button
                className={`${
                  navbarMode === 'dark'
                    ? 'marketing-primary-button'
                    : 'marketing-tertiary-button'
                } rounded-[8px]`}
                variant="secondary"
              >
                Start Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          {navItems.map(({ link, label }) => (
            <NavItem key={link} href={link} onClick={setClose}>
              {label}
            </NavItem>
          ))}
        </div>
        <div className="flex tablet:hidden justify-center gap-x-2">
          <Link href={`${dashboardUrl}/sign-in`} className={cn(styles.link)}>
            <Button
              className={`h-9 w-full ${
                navbarMode === 'dark' ? 'text-white' : 'text-[#00152A]'
              } hover:no-underline`}
              variant="link"
            >
              Log In
            </Button>
          </Link>
          <Link href={`${dashboardUrl}/sign-up`}>
            <Button
              className={`${
                navbarMode === 'dark'
                  ? 'marketing-primary-button'
                  : 'marketing-tertiary-button'
              } rounded-[8px] w-full`}
              variant="secondary"
            >
              Start Now
            </Button>
          </Link>
        </div>
      </div>
      <div
        className="fixed inset-0 z-[9] bg-black bg-opacity-50"
        onClick={setClose}
      />
    </>
  );
};
