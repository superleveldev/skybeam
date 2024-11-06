import { Film, Sparkles, SquareCode } from 'lucide-react';
export const cardsContainerContent = [
  {
    content:
      'Install a Website Tracker to retarget potential customers on TV and measure your impact.',
    cta: 'How to set up pixel',
    icon: <SquareCode className="h-5 w-5" />,
    title: 'Website Tracker Setup',
    tooltip:
      'With a Website Tracker in place, you can unlock better insights and boost your campaign effectiveness.',
    url: 'https://help.skybeam.io/en/articles/10023496-set-up-your-website-tracker',
  },
  {
    content:
      'Want your ad to shine on TV? Ensure your creative meets the guidelines for smooth delivery.',
    cta: 'How to prepare creative',
    icon: <Film className="h-5 w-5" />,
    title: 'Creatives Specifications',
    tooltip:
      'Check out our tips to ensure your creative is ready to go live on TV networks.',
    url: 'https://help.skybeam.io/en/articles/9989835-video-ad-specifications-for-skybeam',
  },
  {
    content:
      'Need help creating your ad? See a list of prominent tools that can help you make stunning TV ads in minutes!',
    cta: 'How to prepare creative',
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Creatives Generation',
    tooltip:
      'Short on time or resources? Use AI to generate a ready-to-air creative quickly.',
    url: 'https://help.skybeam.io/en/articles/9992839-coming-soon-creative-services-and-skybeam',
    isComingSoon: true,
  },
];
