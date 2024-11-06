'use client';

import { Users, UserCircle2, KeyRound, Flag, Wallet } from 'lucide-react';

import { NavLinks } from './nav-links';
import { usePathname } from 'next/navigation';

export const SettingsNavigationMenu = ({
  onClick,
}: {
  onClick?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <NavLinks
      onClick={onClick}
      links={[
        {
          title: 'Account',
          label: '',
          icon: UserCircle2,
          variant: 'ghost',
          url: '/settings/general',
          isActive: pathname === '/settings/general',
        },
        {
          title: 'Password',
          label: '',
          icon: KeyRound,
          variant: 'ghost',
          url: '/settings/password',
          isActive: pathname == '/settings/password',
        },
        {
          title: 'Advertiser',
          label: '',
          icon: Flag,
          variant: 'ghost',
          url: '/settings/advertiser',
          isActive: pathname == '/settings/advertiser',
        },
        {
          title: 'Payment',
          label: '',
          icon: Wallet,
          variant: 'ghost',
          url: '/settings/payment',
          isActive: pathname == '/settings/payment',
        },
        {
          title: 'Users',
          label: '',
          icon: Users,
          variant: 'ghost',
          url: '/settings/users',
          isActive: pathname == '/settings/users',
        },
      ]}
    />
  );
};
