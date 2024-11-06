import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '../../../server/api/root';

export type GetResourceOutput = inferProcedureOutput<
  AppRouter['resources']['getResource']
>;

export type SanityContentProps = NonNullable<GetResourceOutput>['content'];

export type BannerProps = Extract<
  NonNullable<NonNullable<SanityContentProps>[number]['content']>[number],
  { _type: 'banner' }
>;

export type SanityImageProps = Extract<
  NonNullable<NonNullable<SanityContentProps>[number]['content']>[number],
  { _type: 'sanityImage' }
>;

export type QuoteProps = Extract<
  NonNullable<NonNullable<SanityContentProps>[number]['content']>[number],
  { _type: 'quote' }
>;

export type BannerLinkProps = {
  _type: 'link';
  href: string;
  blank: boolean;
};

export type RichTextSpanProps = {
  _type: 'span';
  text: string;
  marks: string[];
  _key: string;
};

export type RichTextBlockProps = Extract<
  NonNullable<RichTextProps['richTextContent']>[number],
  { _type: 'block' }
>;

export type RichTextProps = Extract<
  NonNullable<NonNullable<SanityContentProps>[number]['content']>[number],
  { _type: 'richText' }
>;

export type OneColumnProps = {
  _type: 'oneColumn';
  content: (RichTextProps | SanityImageProps | BannerProps)[] | null;
};

export type TwoColumnProps = Extract<
  NonNullable<SanityContentProps>[number],
  { _type: 'twoColumn' }
>;

export type ContentBlock = OneColumnProps | TwoColumnProps;

export type ContentProps = {
  content?: ContentBlock[];
};
