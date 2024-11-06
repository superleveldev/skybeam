import { Card } from '@limelight/shared-ui-kit/ui/card';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@limelight/shared-ui-kit/ui/form';
import { cn } from '@limelight/shared-utils/classnames/cn';
import {
  RadioGroupIndicator,
  RadioGroupItem,
} from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';
import { ControllerRenderProps, FieldPath } from 'react-hook-form';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';

interface RadioCardProps<
  T extends Record<string, any>,
  F extends FieldPath<T>,
> {
  field?: ControllerRenderProps<T>;
  value: T[F];
  label: ReactNode;
  description: string;
  isComingSoon?: boolean;
  disabled?: boolean;
}

/**
 * A wrapper around the RadioGroupItem component that adds a card-like styling
 *
 * **Note:** This component _MUST_ be used within the RadioGroup component from **@radix-ui/react-radio-group**
 * _NOT_ the RadioGroup component from **@limelight/shared-ui-kit/ui/form**
 */
export default function RadioCard<
  T extends Record<string, any>,
  F extends FieldPath<T>,
>({
  field,
  value,
  description,
  label,
  isComingSoon,
  disabled,
}: RadioCardProps<T, F>) {
  return (
    <Card
      className={cn('w-full md:w-[48%] p-3', {
        'outline-indigo-600 outline': field?.value === value,
        'bg-gray-50': isComingSoon || disabled,
      })}
    >
      <FormItem className="flex items-start justify-between space-x-3 space-y-0">
        <FormLabel
          className={cn(
            'font-medium flex items-center justify-between mb-4 w-full',
            {
              'text-muted-foreground': isComingSoon,
            },
          )}
        >
          {label}
          {isComingSoon && (
            <Badge
              variant="secondary"
              className="rounded-sm bg-gray-200 text-muted-foreground"
            >
              Coming soon
            </Badge>
          )}
        </FormLabel>

        <FormControl>
          {isComingSoon || (
            <RadioGroupItem
              value={value}
              className={cn(
                'f-full h-full min-w-4 min-h-4 border rounded-full flex items-center justify-center',
                {
                  ' border-indigo-600': field?.value === value,
                  ' border-primary': field?.value !== value,
                  'border-muted': disabled,
                },
              )}
              disabled={disabled}
            >
              <RadioGroupIndicator className="flex items-center justify-center w-4 h-4 bg-indigo-600 border border-indigo-600 rounded-full">
                <Check className="h-3 w-3 text-white" />
              </RadioGroupIndicator>
            </RadioGroupItem>
          )}
        </FormControl>
      </FormItem>
      <FormItem>
        <FormDescription className="max-w-[90%]">{description}</FormDescription>
      </FormItem>
    </Card>
  );
}
