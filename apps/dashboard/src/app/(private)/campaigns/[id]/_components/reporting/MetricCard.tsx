import {
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';

export function MetricCardContent({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base pb-0 pt-0 flex gap-2 items-center  ">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full text-2xl font-bold py-0 px-4">
        {value}
      </CardContent>
    </>
  );
}
