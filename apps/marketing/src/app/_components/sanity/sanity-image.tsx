import React from 'react';
import Image from 'next/image';
import { urlFor } from '@limelight/shared-sanity';

import { SanityImageProps } from './types';

export default function SanityImage({ data }: { data: SanityImageProps }) {
  const imageUrl =
    data.asset &&
    urlFor(data.asset)
      .width(757 * 2)
      .url();
  const { width, height } = data?.metadata?.dimensions ?? {};

  return (
    <div className="w-full py-6">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={data.alt || 'Sanity Image'}
          width={width}
          height={height}
          className="object-cover object-center"
        />
      )}
    </div>
  );
}
