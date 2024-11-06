import { FormCampaign } from '@limelight/shared-drizzle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import {
  RadioGroup,
  RadioGroupItem,
} from '@limelight/shared-ui-kit/ui/radio-group';
import { memo, MouseEventHandler, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { Alert, AlertDescription } from '@limelight/shared-ui-kit/ui/alert';
import { Copy, Info, RefreshCcw, TriangleAlert } from 'lucide-react';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@limelight/shared-ui-kit/ui/sheet';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { api } from '../../../../../trpc/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignPixel } from '../../../../../server/actions';

function PixelSelection() {
  const { control, watch } = useFormContext<
    FormCampaign & { pixelId?: string }
  >();

  const [advertiserIdWatch] = watch(['advertiserId']);

  const {
    data: pixels,
    isLoading,
    refetch,
  } = api.pixels.getPixels.useQuery(
    { advertiserId: advertiserIdWatch },
    {
      refetchOnWindowFocus: false,
      notifyOnChangeProps: ['data'],
      enabled: !!advertiserIdWatch,
      select: (data) => data?.pixels,
    },
  );

  return (
    <div className="ps-2 mt-2 pt-2" data-testid="metric-selection">
      <FormField
        control={control}
        name="pixelId"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-strong">Select a pixel</FormLabel>
            {!advertiserIdWatch && <NoAdvertiserAlert />}
            {!isLoading && !pixels?.length && (
              <NoMetricsAlert refetch={refetch} />
            )}
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {advertiserIdWatch && isLoading && (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                  </div>
                )}
                {pixels?.map((pixel) => (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={pixel.id}
                  >
                    <FormControl>
                      <RadioGroupItem value={pixel.id} />
                    </FormControl>
                    <FormLabel className="font-normal">{pixel.name}</FormLabel>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 ms-1 text-inherit underline text-normal"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <MetricSheetContent pixelId={pixel.pixelId} />
                    </Sheet>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default memo(PixelSelection);

function NoAdvertiserAlert() {
  return (
    <Alert variant="warning">
      <AlertDescription className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4" />
        You must select a campaign advertiser before choosing a metric.
      </AlertDescription>
    </Alert>
  );
}

const pixelSchema = z.object({ name: z.string().min(3).max(255) });

function NoMetricsAlert({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      refetch();
    }
    setOpen(nextOpen);
  };
  return (
    <Alert variant="warning">
      <AlertDescription className="flex items-center">
        <TriangleAlert className="h-4 w-4 me-2" />
        Your campaign is missing a web tracking code.{' '}
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button
              variant="link"
              className="p-0 ms-1 text-inherit underline text-normal"
            >
              Set up your Skybeam Pixel.
            </Button>
          </SheetTrigger>
          <MetricSheetContent />
        </Sheet>
      </AlertDescription>
    </Alert>
  );
}

export function MetricSheetContent({
  pixelId: _pixelId,
}: {
  pixelId?: string;
}) {
  const [pixelId, setPixelId] = useState(_pixelId);
  const { watch } = useFormContext<FormCampaign>();
  const advertiserId = watch('advertiserId');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(pixelSchema),
    defaultValues: { name: '' },
  });

  const onSave = async (data: z.infer<typeof pixelSchema>) => {
    setLoading(true);
    let res: Awaited<ReturnType<typeof assignPixel>>;
    try {
      res = await assignPixel({ name: data.name, advertiserId });
      if (res?.id) {
        setPixelId(res.id);
      }

      toast.success('Metric saved successfully');
    } catch (e) {
      toast.error('Error saving metric');
    }
    setLoading(false);
  };

  const onSubmit = form.handleSubmit(onSave);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const copyToClipboard: (
    text: string,
  ) => MouseEventHandler<HTMLButtonElement> = (text) => (e) => {
    e.preventDefault();
    if (!pixelId) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  useEffect(() => {
    setPixelId(pixelId);
  }, [_pixelId]);

  return (
    <SheetContent className="space-y-4 overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mt-4">Setup a Skybeam Pixel</SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <h3>Step 1: Claim your Skybeam Pixel</h3>
      {!pixelId && (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name your pixel</FormLabel>
                  <Input {...field} placeholder="Pixel name" />
                </FormItem>
              )}
            />
            <Button type="submit" className="flex gap-2">
              Generate Pixel
              {loading && <RefreshCcw className="size-4 animate-spin" />}
            </Button>
          </form>
        </Form>
      )}
      {!!pixelId && (
        <div className="relative">
          <Input value={pixelId} readOnly className="pe-6" />
          <Button
            variant="ghost"
            type="button"
            className="absolute right-2 top-[0.75rem] p-0 h-fit"
            onClick={copyToClipboard(pixelId)}
            disabled={!pixelId}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      )}
      <h3>Step 2: Add the pixel to your website</h3>
      <p className="text-sm">
        First, find the{' '}
        <code className="bg-gray-100 p-1">{'<head> </head>'}</code> tags in your
        webpage code, or locate the header template in your CMS or web platform.
      </p>
      <pre className="bg-gray-100 px-2 overflow-x-auto">
        <code className="language-html text-sm">
          {`
<!-- Example -->
<!DOCTYPE html>
  <html lang="en">
    <head>
    <!-- Paste your pixel code here -->
    </head>
        `}
        </code>
      </pre>
      <p className="text-sm">
        Paste the pixel code at the bottom of the header section, just above the{' '}
        <code className="bg-gray-100 p-1">{'</head>'}</code> tag. Skybeam Pixel
        code can be added above or below existing tracking tags (such as Google
        Analytics) in your site header. Paste the code on every page where you
        want to track conversion events
      </p>
      <div className="relative">
        <pre className="bg-gray-100 px-2 overflow-x-auto">
          <code className="language-javascript bg-gray-100 text-sm">
            {`
<!-- Skybeam Analytics -->
<script>
(function(e,n,t){e["$$d2cxFn"]=t;e[t]=e[t]||function(){(e[t].q=e[t].q||[]).push(arguments)};var c=n.getElementsByTagName("script")[0],o=n.createElement("script");o.async=true;o.src="https://analytics-sm.com/js/v1/beacon.js";c.parentNode.insertBefore(o,c)})(window,document,"sm_beacon");
sm_beacon('setup', 'beacon', '${pixelId ?? '{your_pixel_id}'}');
sm_beacon('setup', 'user_tracking', true);
sm_beacon('send', 'pageview');
</script>
<!-- End Skybeam Analytics -->
        `}
          </code>
        </pre>
        <Button
          variant="ghost"
          type="button"
          className="absolute right-2 top-[0.75rem] p-0 h-fit"
          onClick={copyToClipboard(`
<!-- Skybeam Analytics -->
<script>
(function(e,n,t){e["$$d2cxFn"]=t;e[t]=e[t]||function(){(e[t].q=e[t].q||[]).push(arguments)};var c=n.getElementsByTagName("script")[0],o=n.createElement("script");o.async=true;o.src="https://analytics-sm.com/js/v1/beacon.js";c.parentNode.insertBefore(o,c)})(window,document,"sm_beacon");
sm_beacon('setup', 'beacon', '${pixelId ?? '{your_pixel_id}'}');
sm_beacon('setup', 'user_tracking', true);
sm_beacon('send', 'pageview');
</script>
<!-- End Skybeam Analytics -->
        `)}
          disabled={!pixelId}
        >
          <Copy className="size-4" />
        </Button>
      </div>
      <p className="text-sm">
        Learn more about Skybeam pixels the{' '}
        <a
          href="https://help.skybeam.io/en/articles/10023496-set-up-a-skybeam-pixel"
          target="_blank"
          className="text-blue-500 underline"
        >
          Skybeam help center
        </a>
        .
      </p>
      <SheetFooter className="sm:justify-start">
        <SheetClose>
          <Button>Done</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
