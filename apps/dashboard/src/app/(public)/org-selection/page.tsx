import { OrganizationList } from '@clerk/nextjs';
import dynamic from 'next/dynamic';

const MainNav = dynamic(() => import('../../(private)/_components/MainNav'));

export default function OrgSelectionPage() {
  return (
    <>
      <MainNav />
      <main className="flex justify-center items-center ">
        <OrganizationList
          appearance={{
            layout: { unsafe_disableDevelopmentModeWarnings: true },
            elements: { cardBox: { boxShadow: 'none', borderRadius: 'none' } },
          }}
          hidePersonal
          afterSelectOrganizationUrl={'/campaigns'}
          afterCreateOrganizationUrl={'/campaigns'}
          hideSlug
        />
      </main>
    </>
  );
}
