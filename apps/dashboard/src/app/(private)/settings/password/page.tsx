import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import PasswordReset from '../_components/PasswordReset';
import { api } from '../../../../trpc/server';
import { Alert, AlertDescription } from '@limelight/shared-ui-kit/ui/alert';
import { Info } from 'lucide-react';

export default async function PasswordSettingsPage() {
  const hasPassword = await api.users.checkIfUserHasPassword.query();

  return (
    <Card className="flex-grow h-fit col-span-3">
      <CardHeader className="pb-0 px-4 pt-4 space-y-0">
        <CardTitle className="text-xl">Password settings</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {hasPassword && <PasswordReset />}
        {!hasPassword && (
          <Alert variant="default" className="mt-6">
            <AlertDescription className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Your account does not use password authentication. Please contact
              support to enable password authentication.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
