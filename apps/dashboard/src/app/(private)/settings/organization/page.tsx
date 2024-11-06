import { OrganizationForm } from './organization-form';
import { auth, clerkClient } from '@clerk/nextjs/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';

export default async function OrganizationSettingsPage() {
  const authData = auth();

  // extra sanity check; middleware should prevent this
  if (!authData.orgId || !authData.userId) return null;

  const organization = await clerkClient.organizations.getOrganization({
    organizationId: authData.orgId,
  });

  return (
    <Card className="flex-grow col-span-3">
      <CardHeader className="pb-0 px-4 pt-4 space-y-0">
        <CardTitle className="text-3xl">Profile settings</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <OrganizationForm name={organization.name} />
      </CardContent>
    </Card>
  );
}
