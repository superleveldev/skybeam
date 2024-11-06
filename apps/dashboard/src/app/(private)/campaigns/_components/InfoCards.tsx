import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import Link from 'next/link';
import { InfoCardProps } from '../types';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';

export default function InfoCards({
  content,
  cta,
  title,
  url,
  icon,
  isComingSoon,
}: InfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="px-4 pt-4 pb-0">
        <div className="flex justify-between">
          <div className="mb-2 p-2 border rounded-sm max-w-fit  bg-slate-200 bg-gradient-to-b from-white to-[#f2f2f2">
            {icon}
          </div>
          {isComingSoon && (
            <Badge className="rounded-sm bg-gray-200 text-muted-foreground h-fit">
              Coming soon
            </Badge>
          )}
        </div>
        <CardTitle data-testid={title} className="font-bold text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs px-4 mt-1.5 pb-4">
        {content}
        <p className="mt-1.5">
          <Link className="text-primary font-bold" href={url} target="_blank">
            {cta} &rarr;
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
