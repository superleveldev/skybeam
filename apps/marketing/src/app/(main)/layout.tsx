import { Navbar } from '../_components/navbar';
import { Footer } from '../_components/footer';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col h-full'}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
