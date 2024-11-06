import Link from 'next/link';
import { PortableText, PortableTextComponents } from 'next-sanity';

import { RichTextBlockProps } from './types';

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-[#00152A] pt-8 pb-5 text-[2rem] font-light laptop:text-[3.125rem]">
        {children}
      </h2>
    ),
    normal: ({ children }) => <p className="text-[#00152A]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-2">{children}</ol>
    ),
  },
  listItem: ({ children }) => (
    <li className="ml-2 text-[#00152A]">
      <p>{children}</p>
    </li>
  ),
  marks: {
    link: ({ value, children }) => {
      return (
        <Link
          className="text-[#0056ED] underline"
          href={value?.href}
          target={value?.blank ? '_blank' : '_self'}
        >
          {children}
        </Link>
      );
    },
  },
};

export default function RichText({
  richText,
}: {
  richText: RichTextBlockProps[];
}) {
  return <PortableText value={richText} components={portableTextComponents} />;
}
