import {
  Card,
  CardContent,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
import UserForm from '../../_components/UserForm';

export default function Page() {
  return (
    <main className="container grid grid-cols-5 grid-rows-1 gap-4 mx-auto pb-6">
      <div className="col-span-5 md:col-span-3 md:col-start-2">
        <Card>
          <CardHeader>Add User</CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
