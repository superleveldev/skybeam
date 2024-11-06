import React from 'react';

import TwoColumn from './two-column';
import OneColumn from './one-column';

import { SanityContentProps } from './types';

export default function SanityContent({
  content,
}: {
  content?: SanityContentProps;
}) {
  return content?.map((block) => {
    if (block._type === 'oneColumn') {
      return <OneColumn key={block._key} data={block} />;
    } else if (block._type === 'twoColumn') {
      return <TwoColumn key={block._key} data={block} />;
    }
    return null;
  });
}
