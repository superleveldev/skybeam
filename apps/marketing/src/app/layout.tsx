import { GoogleAnalytics } from '@next/third-parties/google';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';

import { TRPCReactProvider } from '../trpc/react';
import { Providers } from './providers';
import localFont from 'next/font/local';

import '../styles/global.css';

import type { Metadata } from 'next';
import LinkedInPixel from './_components/linkedin-pixel';
import MetaPixel from './_components/meta-pixel';
import SkybeamPixel from './_components/skybeam-pixel';

const inter = Inter({ subsets: ['latin'] });

const franklinGothic = localFont({
  src: './FranklinGothicStd-Condensed.otf',
  display: 'swap',
  variable: '--franklin',
});

const gelica = localFont({
  src: [
    {
      path: './GelicaFont/GelicaBlackItalic/font.woff',
      weight: '900',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaBlack/font.woff',
      weight: '900',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaBoldItalic/font.woff',
      weight: '700',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaBold/font.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaExtraLightItalic/font.woff',
      weight: '200',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaExtraLight/font.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaItalic/font.woff',
      weight: '400',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaLightItalic/font.woff',
      weight: '300',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaLight/font.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaMediumItalic/font.woff',
      weight: '500',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaMedium/font.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaRegular/font.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './GelicaFont/GelicaSemiBoldItalic/font.woff',
      weight: '600',
      style: 'italic',
    },
    {
      path: './GelicaFont/GelicaSemiBold/font.woff',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--gelica',
});

const proximaNova = localFont({
  src: [
    {
      path: './ProximaNovaFont/ProximaNova-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './ProximaNovaFont/ProximaNova-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './ProximaNovaFont/ProximaNova-Semibold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: './ProximaNovaFont/ProximaNova-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--proxima-nova',
});

export const metadata: Metadata = {
  title: 'Skybeam',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics
        debugMode={process.env.NODE_ENV !== 'production'}
        gaId="G-X4PQWZ7EX8"
      />

      <body
        className={`h-full font-sans ${inter.className} ${franklinGothic.variable} ${gelica.variable} ${proximaNova.variable} bg-gray-200`}
      >
        <LinkedInPixel />
        <MetaPixel />
        <SkybeamPixel />
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
