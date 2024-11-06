'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { NavbarMobile } from './navbar-mobile';
import { NavItem } from './nav-item';
import { ReactComponent as Logo } from '../../../../public/skybeam-logo-with-text-blue.svg';
import { ReactComponent as MenuSVG } from '../../../../public/menu.svg';

import styles from './navbar.module.css';

const navItems = [
  { link: '/insights', label: 'Insights Hub' },
  { link: '/resources', label: 'Blog' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/about', label: 'About Us' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  const getInitialNavbarMode = () => {
    if (pathname.startsWith('/resources/')) {
      return 'white';
    }
    if (
      pathname !== '/' &&
      pathname !== '/resources' &&
      pathname !== '/pricing'
    ) {
      return 'light';
    }
    return 'dark';
  };

  const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [navbarMode, setNavbarMode] = useState<'light' | 'dark' | 'white'>(
    getInitialNavbarMode,
  );

  const handleOpenMenu = () => {
    setIsNavbarMobileOpen(true);
  };

  const handleCloseMenu = () => {
    setIsNavbarMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentSection: any = null;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          currentSection = section as HTMLElement;
        }
      });

      if (currentSection) {
        const sectionId = currentSection.getAttribute('data-section');

        setIsTransparent(
          window.scrollY <= 0 && sectionId === 'heading-section',
        );

        if (
          sectionId === 'heading-section' ||
          sectionId === 'faq-section' ||
          sectionId === 'resources-section' ||
          sectionId === 'pricing-heading-section'
        ) {
          setNavbarMode('dark');
        } else if (sectionId === 'article-section') {
          setNavbarMode('white');
        } else {
          setNavbarMode('light');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (isNavbarMobileOpen) {
    return <NavbarMobile navbarMode={navbarMode} setClose={handleCloseMenu} />;
  } else {
    return (
      <div
        data-test-header
        className={cn(
          styles.navbar,
          styles[navbarMode],
          { [styles.transparent]: isTransparent },
          'flex justify-center px-[152px] py-[22px] w-full z-[100] transition-colors duration-500',
        )}
      >
        <div className="flex justify-between items-center w-full max-w-full desktop:max-w-[71rem]">
          <div className={cn(styles.navbarContent, 'flex gap-10')}>
            <MenuSVG className={styles.navMenu} onClick={handleOpenMenu} />
            <Link href="/">
              <Logo
                id="skybeam-logo"
                className="w-[99px] h-[32px] tablet:w-full tablet:h-full"
              />
            </Link>
            <div className="hidden desktop:flex items-center">
              {navItems.map(({ link, label }) => (
                <NavItem
                  key={link}
                  href={link}
                  isActive={pathname === link || pathname.startsWith(link)}
                >
                  {label}
                </NavItem>
              ))}
            </div>
          </div>
          <div className="hidden items-center tablet:flex gap-x-2">
            <NavItem href={`${dashboardUrl}/sign-in`}>
              <Button
                data-test-log-in-btn
                className={`h-[38px] ${
                  navbarMode !== 'white' ? 'text-white' : 'text-[#0A0A0A]'
                } hover:no-underline`}
                variant="link"
              >
                Log In
              </Button>
            </NavItem>
            <Link href={`${dashboardUrl}/sign-up`}>
              <Button
                data-test-sign-up-btn
                className={`${
                  navbarMode === 'dark'
                    ? 'marketing-primary-button'
                    : 'marketing-tertiary-button'
                } h-[38px]`}
                variant="secondary"
              >
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};
