import { getBlogPosts } from '../../../server/queries';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import Link from 'next/link';

export default function BlogPost({ params }: { params: { slug: string } }) {
  // TODO: allow page nesting
  const postSlug = params.slug[0];

  return <PostContent slug={postSlug} />;
}

/**
 * This blog was built assuming RSC request-time for data fetching content.
 *
 * If wanting to generate the pages at build time, utilize this:
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
const PostContent = async ({ slug }: { slug: string }) => {
  const posts = await getBlogPosts({ slug });
  const post = posts[0];

  return (
    <article className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-8">
        {post.publishedAt.toDateString()}
      </p>
      <div className="prose max-w-none">
        CONTENT
        {/*{post.body}*/}
      </div>
      <div className="mt-8">
        <Button variant={'secondary'} asChild>
          <Link href="/blog">Back to Home</Link>
        </Button>
      </div>
    </article>
  );
};
