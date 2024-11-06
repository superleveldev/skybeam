import { ClerkLoaded, SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import TypeSelector from './components/TypeSelector';

export default function Page({
  searchParams,
}: {
  searchParams: { type: string };
}) {
  return (
    <div className="flex justify-start items-center bg-white h-full w-full overflow-y-auto">
      <div className=" w-full md:w-[40%] h-full flex gap-16 p-6 items-center flex-col max-h-screen relative">
        <SignUp
          appearance={{
            layout: {
              socialButtonsPlacement: 'bottom',
              unsafe_disableDevelopmentModeWarnings: true,
            },
            elements: {
              cardBox: {
                borderRadius: 'none',
                boxShadow: 'none',
                background: 'none',

                overflow: 'visible',
              },
              card: { background: 'none', boxShadow: 'none', gap: '' },
              footer: { background: 'none' },
              formFieldRow__name: {
                flexDirection: 'column',
                marginBottom: '6rem',
              },
              headerTitle: {
                textAlign: 'left',
                fontSize: '2rem',
              },
              headerSubtitle: { display: 'none' },
              logoBox: { justifyContent: 'flex-start', height: '30.72px' },
            },
          }}
          unsafeMetadata={{ userType: searchParams?.type ?? 'agency' }}
        />
        <TypeSelector value={searchParams?.type ?? 'agency'} />
        <ClerkLoaded>
          <div className="text-sm text-muted-foreground flex flex-col gap-2 items-center justify-center">
            <div className="flex gap-2">
              <a
                href="https://www.skybeam.io/terms-of-services"
                target="_blank"
              >
                Terms of Services
              </a>
              <span>|</span>
              <a href="https://www.skybeam.io/privacy-policy" target="_blank">
                Privacy Policy
              </a>
            </div>
            <span className="text-center">
              © {new Date().getFullYear()} Skybeam<sup>TM</sup>, a division of
              Simulmedia. All Rights Reserved.
            </span>
          </div>
        </ClerkLoaded>
      </div>
      <div className="flex justify-center bg-none w-0 md:w-[60%] fixed right-0 h-full max-h-screen">
        <ClerkLoaded>
          <div className="relative h-full max-h-screen w-full bg-blue-700">
            <Image
              src="/beam-left.svg"
              alt="Skybeam Auth Screen"
              fill
              style={{
                objectFit: 'cover',
              }}
            />
            <Image
              src="/auth-new.png"
              alt="Skybeam Auth Screen"
              fill
              style={{
                objectFit: 'cover',
              }}
            />
            <Image
              src="/beam-right.svg"
              alt="Skybeam Auth Screen"
              fill
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}
