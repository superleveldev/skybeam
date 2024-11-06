import ImpressionForecaster from './_components/impression-forecaster';
import Section from './_components/section';

export const generateMetadata = () => ({
  title: 'CTV & Streaming TV Advertising Calculator',
  description:
    "📊 Forecast your TV ad campaign impact in minutes! Use Skybeam's Impression Forecaster to estimate reach, clicks, and ROI — so you can make every dollar count 🚀",
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

export default async function InsightsPage() {
  return (
    <Section>
      <ImpressionForecaster />
    </Section>
  );
}
