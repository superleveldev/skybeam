import { Heading } from './heading';
import { Team } from './team';
import { Schedule } from './schedule';
import { Careers } from './careers';
import { Simulmedia } from '../../_components/simulmedia';

export const generateMetadata = () => ({
  title: 'About Us',
  description:
    '🚀 Discover Skybeam’s mission and dedicated team behind it! We’re making TV advertising accessible for all businesses.',
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

export default async function AboutPage() {
  return (
    <div data-section="about-page">
      <Heading />
      <Team />
      <Simulmedia />
      <Schedule />
      <Careers />
    </div>
  );
}
