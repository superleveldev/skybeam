import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import { TRPCReactProvider } from '../trpc/react';
import { Providers } from './providers';
import { cookies } from 'next/headers';
import { Toaster } from '@limelight/shared-ui-kit/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skybeam',
  description: 'Skybeam Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`h-full font-sans ${inter.className} bg-gray-50`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>{children}</Providers>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
