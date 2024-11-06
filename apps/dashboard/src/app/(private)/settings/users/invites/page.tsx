import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import { Table } from '@limelight/shared-ui-kit/ui/table';
import Pagination from '@limelight/shared-ui-kit/core/Pagination';
import { api } from '../../../../../trpc/server';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import InviteList from '../../_components/InviteList';
import UserTabs from '../_components/UserTabs';

type UserData = {
  id: string;
  name: string;
  email: string | undefined;
  createdAt: number;
};

export default async function UsersSettingsPage({
  searchParams,
}: {
  searchParams: {
    sort: `${keyof Omit<UserData, 'id'>}` | `-${keyof Omit<UserData, 'id'>}`;
    page: string;
    search?: string;
  };
}) {
  const { orgRole } = await auth();
  const { totalCount: membershipCount } =
    await api.organizations.getMembers.query({ limit: '0' });
  const { data: invites, totalCount: inviteTotalCount } =
    await api.organizations.getInvites.query({
      limit: '10',
      page: searchParams.page ?? '1',
    });

  return (
    <div className="flex-grow col-span-4 relative w-full">
      {orgRole === 'org:admin' && (
        <Link
          href="/users/new"
          className="-top-20 mt-2 right-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 absolute  gap-2"
        >
          <UserPlus className="size-4" /> Add User
        </Link>
      )}
      <Card className="w-full ">
        <CardHeader className="pb-0 px-0 pt-4 space-y-4 flex flex-col gap-2 items-start justify-start flex-wrap">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-xl inline-block w-fit ps-4">
              User Settings
            </CardTitle>
          </div>
          <UserTabs
            totalInvites={inviteTotalCount}
            totalMembers={membershipCount}
          />
        </CardHeader>
        <CardContent className="pb-4 px-0 w-full">
          <Table>
            <InviteList
              invites={invites}
              searchParams={{ page: searchParams.page }}
              currentUserRole={`${orgRole}`}
            />
          </Table>
          <Pagination
            className="mt-4"
            searchParams={{
              page: searchParams.page,
            }}
            total={inviteTotalCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
