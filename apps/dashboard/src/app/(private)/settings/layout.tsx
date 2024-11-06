import { ReactNode } from 'react';
import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { SettingsNavigationMenu } from './_components/settings-navigation-menu';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container pt-5">
      <h1 className="font-bold text-3xl">Settings</h1>
      <div className="grid grid-cols-5 grid-rows-1 gap-4 mx-auto pb-6 mt-7">
        <Card className="w-fit md:w-full h-fit">
          <CardContent className="py-4 px-4">
            <SettingsNavigationMenu />
          </CardContent>
        </Card>
        {children}
      </div>
    </div>
  );
}
