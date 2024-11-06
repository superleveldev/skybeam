import { ReactNode } from 'react';

export default async function Layout({
  children,
  campaignModal,
}: {
  children: ReactNode;
  campaignModal: ReactNode;
}) {
  return (
    <>
      {children}
      {campaignModal}
    </>
  );
}
