import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import { Table } from '@limelight/shared-ui-kit/ui/table';
import Pagination from '@limelight/shared-ui-kit/core/Pagination';
import { api } from '../../../../trpc/server';
import UserList from '../_components/UserList';
import Search from '@limelight/shared-ui-kit/core/Search';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

import UserTabs from './_components/UserTabs';
import { auth } from '@clerk/nextjs/server';

type UserData = {
  id: string;
  name: string;
  email: string | undefined;
  createdAt: number;
};

type sortParam =
  | `${keyof Omit<UserData, 'id'>}`
  | `-${keyof Omit<UserData, 'id'>}`;

type OrderBy = Parameters<
  typeof api.organizations.getMembers.query
>[0]['orderBy'];

const sortMap: Record<sortParam, OrderBy> = {
  name: 'first_name',
  email: 'email_address',
  createdAt: 'created_at',
  '-name': '-first_name',
  '-email': '-email_address',
  '-createdAt': '-created_at',
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
  const orderBy = sortMap[searchParams.sort] ?? '-created_at';
  const { data: users, totalCount } = await api.organizations.getMembers.query({
    orderBy,
    query: searchParams.search,
    limit: '10',
    page: searchParams.page ?? '1',
  });
  const { totalCount: totalInvites } = await api.organizations.getInvites.query(
    {
      limit: '0',
    },
  );

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
            <Search
              className="max-w-lg me-4"
              searchParams={{
                sort: searchParams?.sort?.replace('-', '') ?? 'createdAt',
                sortDir: searchParams?.sort?.startsWith('-') ? 'desc' : 'asc',
                search: searchParams.search,
                page: searchParams.page,
              }}
            />
          </div>
          <UserTabs totalMembers={totalCount} totalInvites={totalInvites} />
        </CardHeader>
        <CardContent className="pb-4 px-0 w-full">
          <Table>
            <UserList
              users={users}
              searchParams={{
                sort: searchParams?.sort?.replace('-', '') ?? 'createdAt',
                sortDir: searchParams?.sort?.startsWith('-') ? 'desc' : 'asc',
              }}
              currentUserRole={`${orgRole}`}
            />
          </Table>
          <Pagination
            className="mt-4"
            searchParams={{
              sort: searchParams?.sort?.replace('-', '') ?? 'createdAt',
              sortDir: searchParams?.sort?.startsWith('-') ? 'desc' : 'asc',
              page: searchParams.page,
            }}
            total={totalCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
