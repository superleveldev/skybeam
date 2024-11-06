import { Heading } from '../_components/heading';
import { Features } from '../_components/features';
import { Logos } from '../_components/logos';
import { Apps } from '../_components/apps';
import { Simulmedia } from '../_components/simulmedia';
import { Contact } from '../_components/contact';
import { FAQ } from '../_components/faq';

export const generateMetadata = () => ({
  title: 'Skybeam: CTV & Streaming TV Advertising Platform',
  description:
    '🚀 Unlock the power of streaming TV with Skybeam! Our TV Ads Manager makes it easy to launch and optimize campaigns that amplify your marketing ✨',
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_MARKETING_URL}/social-share.png`,
        width: 1200,
        height: 630,
        alt: 'Skybeam: CTV & Streaming TV Advertising Platform',
      },
    ],
  },
});

export default async function HomePage() {
  return (
    <div className="bg-white">
      <Heading />
      <Logos />
      <Features />
      <Apps />
      <Simulmedia />
      <Contact />
      <FAQ />
    </div>
  );
}
