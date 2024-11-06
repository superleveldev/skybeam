import { redirect } from 'next/navigation';

export default function Page({
  params: { advertiserId },
}: {
  params: { advertiserId: string };
}) {
  redirect(`/advertisers/${advertiserId}/edit`);
}
