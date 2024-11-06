import { FormCampaign } from '@limelight/shared-drizzle';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { useFormContext } from 'react-hook-form';

export default function CampaignNameInput() {
  const { control } = useFormContext<FormCampaign>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base flex items-center gap-2">
            Campaign name
          </FormLabel>
          <FormControl>
            <Input placeholder="Campaign Name" {...field} />
          </FormControl>
          <FormDescription>
            Give your campaign a unique name to help you track it. Make it
            specific to easily identify its focus!
          </FormDescription>
          <FormMessage data-testid="campaign-name-message" />
        </FormItem>
      )}
    />
  );
}
