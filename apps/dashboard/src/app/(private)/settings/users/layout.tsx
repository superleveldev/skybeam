import { ReactNode } from 'react';

export default async function Layout({
  children,
  usersModal,
}: {
  children: ReactNode;
  usersModal: ReactNode;
}) {
  return (
    <>
      {children}
      {usersModal}
    </>
  );
}
