import React from 'react';
import Link from 'next/link';

import { cn } from '@limelight/shared-utils/classnames/cn';

import styles from './navbar.module.css';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: VoidFunction;
}

export const NavItem: React.FC<NavItemProps> = ({
  href,
  isActive = false,
  children,
  onClick,
}) => {
  return (
    <Link
      data-test-nav-btn={href}
      className={cn(styles.navLink, { [styles.isActive]: isActive })}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
