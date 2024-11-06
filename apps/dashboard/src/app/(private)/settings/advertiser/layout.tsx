import { ReactNode } from 'react';

export default async function Layout({
  children,
  advertiserModal,
}: {
  children: ReactNode;
  advertiserModal: ReactNode;
}) {
  return (
    <>
      {children}
      {advertiserModal}
    </>
  );
}
