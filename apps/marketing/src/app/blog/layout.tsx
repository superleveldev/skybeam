import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Limelight | Blog',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Limelight Blog</h1>
      {children}
    </div>
  );
}
