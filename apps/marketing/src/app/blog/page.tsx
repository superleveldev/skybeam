import { getBlogPosts } from '../../server/queries';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import Link from 'next/link';

export default function Blog() {
  return <BlogContent />;
}

/**
 * This blog was built assuming RSC request-time for data fetching content.
 *
 * If wanting to generate the pages at build time, utilize this:
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
const BlogContent = async () => {
  const posts = await getBlogPosts({ limit: 5 });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/*<p className="text-muted-foreground">{post.excerpt}</p>*/}
            <p className="text-muted-foreground">TODO: excerpt</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {post.publishedAt.toDateString()}
            </span>
            <Button variant={'secondary'} asChild>
              <Link href={`/blog/${post.slug}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
