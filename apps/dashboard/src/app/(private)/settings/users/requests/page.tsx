import { redirect } from 'next/navigation';

//  TODO: Add request list when server-side handling is ready

export default async function UsersSettingsPage() {
  redirect('/settings/users');
}
