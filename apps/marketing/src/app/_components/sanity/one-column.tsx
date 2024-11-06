import React from 'react';

import Banner from './banner';
import RichText from './rich-text';
import SanityImage from './sanity-image';
import Section from './section';
import { OneColumnProps } from './types';

export default function OneColumn({ data }: { data: OneColumnProps }) {
  return (
    // TODO will be reverted back next sprint
    // <Section className="max-w-[1440px] mx-auto">
    //   <div className="flex flex-col-reverse desktop:flex-row desktop:space-x-6">
    //     <div className="w-full desktop:w-2/3">
    //       {data?.content?.map((item) => {
    //         if (item._type === 'richText') {
    //           return (
    //             <RichText key={item._key} richText={item.richTextContent!} />
    //           );
    //         }
    //         if (item._type === 'sanityImage') {
    //           return <SanityImage key={item._key} data={item} />;
    //         }
    //         if (item._type === 'banner') {
    //           return <Banner key={item._key} banner={item} />;
    //         }
    //         return null;
    //       })}
    //     </div>
    //     <div className="w-full desktop:w-1/3" />
    //   </div>
    // </Section>
    <Section className="max-w-max flex">
      <div className="two-column tablet:w-[725px] flex-col">
        {data?.content?.map((item) => {
          if (item._type === 'richText') {
            return (
              <RichText key={item._key} richText={item.richTextContent!} />
            );
          }
          if (item._type === 'sanityImage') {
            return <SanityImage key={item._key} data={item} />;
          }
          if (item._type === 'banner') {
            return <Banner key={item._key} banner={item} />;
          }
          return null;
        })}
      </div>
    </Section>
  );
}
