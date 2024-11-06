import React from 'react';

import { cn } from '@limelight/shared-utils/classnames/cn';
import { Accordion } from './faq-accordion';

import styles from './faq.module.css';

const data = [
  {
    title: 'What’s the difference between CTV, OTT, and streaming?',
    content:
      'Streaming is a broad term for delivering audio and video content over the internet to any device. OTT (Over-the-Top) refers to streaming content directly over the internet without using traditional cable or satellite, accessible on various devices, like smartphones or tablets. CTV (Connected TV) specifically means streaming OTT content on a television screen through a smart TV, streaming device, or gaming console. While OTT can include various devices, CTV focuses solely on the TV screen.',
    isOpenByDefault: true,
  },
  {
    title: 'What is Skybeam TV Ads Manager?',
    content:
      'Skybeam TV Ads Manager is an easy-to-use Ad platform that helps solo marketers working with small and midsize businesses create and run TV ads on streaming services, using AI to make the process simple and efficient.',
  },
  {
    title: 'How does Skybeam can help me reach my audience?',
    content:
      'Skybeam helps you reach your audience by delivering highly targeted, data-driven CTV ad campaigns that ensure your ads are seen by the right people on streaming platforms.',
  },
  {
    title: 'Does Skybeam offer creative support for ad production?',
    content:
      'Skybeam offers creative support for ad production through our trusted partners, or you can easily upload and use your own creative assets to run your campaigns.',
  },
  {
    title: 'What types of TV ads can I run with Skybeam?',
    content:
      'With Skybeam, you can run a variety of TV ads on streaming platforms, all tailored to reach your target audience across different devices and channels.',
  },
  {
    title: 'Do I need technical skills to use Skybeam?',
    content:
      "No, you don’t need technical skills to use Skybeam — it's a self-serve, intuitive platform designed to be easily understandable for all users.",
  },
];

export const FAQ: React.FC = () => {
  return (
    <div
      data-section="faq-section"
      className={cn(
        styles.faqContainer,
        'flex justify-center py-24 px-[9.5rem] bg-[#00152A]',
      )}
    >
      <div
        className={cn(
          styles.faqContent,
          'flex gap-x-16 justify-between max-w-[71rem] w-full',
        )}
      >
        <div
          className={cn(
            styles.faqTextContainer,
            'flex flex-col ap-y-5 w-[45%] max-w-[448px]',
          )}
        >
          <h2 className={styles.faqTitle}>FAQ</h2>
          <p className={styles.faqSubtitle}>
            You'll find quick answers on getting started with Skybeam TV Ads
            Manager, optimizing your campaigns, and using our key features to
            reach your target audience effectively.
          </p>
        </div>
        <div className={cn(styles.faqAccordionContainer, 'w-[55%]')}>
          <Accordion data={data} />
        </div>
      </div>
    </div>
  );
};
