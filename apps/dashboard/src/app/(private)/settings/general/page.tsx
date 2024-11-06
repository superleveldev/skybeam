import { ProfileForm } from './profile-form';
import { currentUser } from '@clerk/nextjs/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';

export default async function GeneralSettingsPage() {
  const user = await currentUser();

  let email = '';
  let phone;

  user?.emailAddresses.forEach((item) => {
    if (item.id === user?.primaryEmailAddressId) email = item.emailAddress;
  });

  user?.phoneNumbers.forEach((item) => {
    if (item.id === user?.primaryPhoneNumberId) phone = item.phoneNumber;
  });

  return (
    <Card className="flex-grow col-span-4">
      <CardHeader className="pb-0 px-4 pt-4 space-y-0">
        <CardTitle className="text-xl">Profile settings</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ProfileForm
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
          email={email}
          phone={phone}
        />
      </CardContent>
    </Card>
  );
}
