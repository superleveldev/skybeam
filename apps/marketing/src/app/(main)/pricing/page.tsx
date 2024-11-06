import { Heading } from './_components/heading';
import { BasicPlan } from './_components/basic-plan';
import { KeepItSimple } from './_components/keep-it-simple';
import { FAQ } from './_components/faq';
import { Contact } from '../../_components/contact';

export const generateMetadata = () => ({
  title: 'Flexible Plans for CTV & Streaming Advertising',
  description:
    '💰 Find a plan that works for you! Discover Skybeam’s flexible pricing options for total control over your streaming TV campaigns',
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

export default async function PricingPage() {
  return (
    <div className="bg-white">
      <Heading />
      <BasicPlan />
      <KeepItSimple />
      <FAQ />
      <Contact containerStyle="bg-[#F4F6FF]" />
    </div>
  );
}
