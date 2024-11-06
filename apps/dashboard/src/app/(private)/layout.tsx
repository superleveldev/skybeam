import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import dynamic from 'next/dynamic';

const MainNav = dynamic(() => import('./_components/MainNav'));

export default async function Layout({ children }: { children: ReactNode }) {
  const currentAuth = auth().protect({
    unauthenticatedUrl: '/sign-in',
  });

  if (!currentAuth.orgId) {
    // We have some orgs, but no active org => back to org selection
    redirect('/org-selection');
  }

  return (
    <div>
      <MainNav />
      {children}
    </div>
  );
}
