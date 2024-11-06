import React from 'react';

import Quote from './quote';
import SanityImage from './sanity-image';

import { TwoColumnProps } from './types';

export default function TwoColumn({ data }: { data: TwoColumnProps }) {
  return (
    <div className="two-column">
      {data?.content?.map((item) => {
        if (item._type === 'sanityImage') {
          return <SanityImage key={item._key} data={item} />;
        }
        if (item._type === 'quote') {
          return <Quote key={item._key} data={item} />;
        }
        return null;
      })}
    </div>
  );
}
