import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@limelight/shared-sanity';

import { BannerProps } from './types';

export default async function Banner({ banner }: { banner: BannerProps }) {
  const { bannerImage, link } = banner;
  const imageUrl =
    bannerImage?.asset && urlFor(bannerImage?.asset).width(757).url();

  return (
    <div className="py-6 tablet:py-10">
      <div className="w-full h-[260px] relative rounded-xl overflow-hidden">
        {imageUrl && link?.href && (
          <Link href={link?.href} className="block">
            <Image
              src={imageUrl}
              alt={bannerImage.alt || 'Banner Image'}
              fill
              className="object-cover object-center"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
