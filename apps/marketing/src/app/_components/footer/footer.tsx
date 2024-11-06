'use client';
import React from 'react';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { NavItem } from '../navbar/nav-item';
import { ReactComponent as Logo } from '../../../../public/skybeam-logo-with-text-with-tm.svg';
import { ReactComponent as Facebook } from '../../../../public/facebook-logo.svg';
import { ReactComponent as Linkedin } from '../../../../public/linkedin-logo.svg';
import { ReactComponent as X } from '../../../../public/x-logo.svg';

import styles from './footer.module.css';

const navItems = [
  { link: '/insights', label: 'Insights Hub' },
  { link: '/resources', label: 'Blog' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/about', label: 'About Us' },
  { link: 'https://help.skybeam.io/en/', label: 'Help Center' },
  { link: '/terms-of-services', label: 'Terms of Services' },
  { link: '/privacy-policy', label: 'Privacy Policy' },
];

export const Footer: React.FC = () => {
  return (
    <div
      className={cn(
        styles.footerContainer,
        'flex justify-center pt-12 pb-20 px-[9.5rem] bg-[#0A0A0A]',
      )}
    >
      <div className="w-full max-w-full flex flex-col gap-y-6 tablet:max-w-[572px] laptop:max-w-[880px] desktop:max-w-[71rem]">
        <div
          className={cn(
            styles.footerLinksContainer,
            'flex items-center gap-x-16',
          )}
        >
          <div
            className={cn(
              styles.footerNav,
              'flex items-center gap-x-14 text-[#EAECF0]',
            )}
          >
            <div
              data-test-footer
              className={cn(
                styles.footerNavLinks,
                'flex items-center flex-wrap gap-6 text-[0.875rem]',
              )}
            >
              {navItems.map(({ link, label }) => (
                <NavItem key={`footer-${label}`} href={link}>
                  <p>{label}</p>
                </NavItem>
              ))}
            </div>
          </div>
          <div className="flex gap-x-6 text-transparent">
            <NavItem href="https://www.linkedin.com/company/skybeam-io/">
              <Linkedin />
            </NavItem>
            <NavItem href="https://www.facebook.com/skybeam.tv.ads/">
              <Facebook />
            </NavItem>
            <NavItem href="https://x.com/Skybeam_TV_Ads">
              <X />
            </NavItem>
          </div>
        </div>
        <div className={styles.footerRightsText}>
          <NavItem href="/">
            <Logo className={cn(styles.footerLogo, 'h-[31px]')} />
          </NavItem>
          <p>2024 Skybeam™, a division of Simulmedia. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};
