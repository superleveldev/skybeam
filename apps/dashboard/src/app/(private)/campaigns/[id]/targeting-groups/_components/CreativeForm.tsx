import { CardContent, CardHeader } from '@limelight/shared-ui-kit/ui/card';
import { ArrowUp, Check, FileVideo, Sparkles } from 'lucide-react';
import { cn, formatMilliseconds } from '@limelight/shared-utils/index';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@limelight/shared-ui-kit/ui/command';
import { Creative } from '@limelight/shared-drizzle';
import RadioCard from '../../../../_components/RadioCard';
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroup as RadioGroupPrimitive,
} from '@radix-ui/react-radio-group';
import { useState } from 'react';
import { RadioItem } from '@radix-ui/react-dropdown-menu';

interface CreativeFormProps {
  creatives: Creative[];
  selectedCreative: string | null;
  setSelectedCreative: (creativeId: string) => void;
  toggleOpen: (open: boolean) => void;
}

export default function CreativeForm({
  creatives,
  selectedCreative,
  setSelectedCreative,
  toggleOpen,
}: CreativeFormProps) {
  const [creativeMode, setCreativeMode] = useState<string>('upload');

  return (
    <>
      <CardHeader className="font-medium ps-2 pb-1 text-lg">
        <span>Creatives</span>
      </CardHeader>
      <CardContent className="px-2 pt-1 pb-6 my-1">
        <RadioGroupPrimitive
          className="flex w-full flex-wrap justify-center gap-4 mb-4"
          value={creativeMode}
          onValueChange={(value) => setCreativeMode(value)}
        >
          <RadioCard
            value="upload"
            label={
              <div className="flex justify-center items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Select/Upload Existing Creative
              </div>
            }
            description="Drive people to your website"
          />
          <RadioCard
            value="generate"
            isComingSoon
            label={
              <div className="flex justify-center items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate New Creative
              </div>
            }
            description="Generate production-grade creative with a single prompt"
          />
        </RadioGroupPrimitive>
        <div className="flex justify-between mb-2 text-sm">
          <h5 className="font-medium">Your creatives</h5>
          {creativeMode === 'upload' && (
            <span
              className="text-primary"
              onClick={() => toggleOpen(true)}
              role="button"
            >
              Upload New Creative
            </span>
          )}
        </div>
        <RadioGroupPrimitive
          className="border-t border-x rounded-sm w-full md:min-w-[450px]"
          onValueChange={(value) => setSelectedCreative(value)}
          value={selectedCreative ?? undefined}
        >
          {creatives?.map((creative) => (
            <RadioGroupItem
              className={cn(
                selectedCreative === creative.id
                  ? 'bg-gray-100 data-[selected="true"]:bg-gray-100'
                  : '',
                'border-b f-full flex gap-4 h-full items-center px-4 py-2 text-sm w-full',
              )}
              key={creative.id}
              value={creative.id}
            >
              <div className="border border-gray-300 h-4 rounded-full w-4">
                <RadioGroupIndicator className="bg-indigo-600 border border-indigo-600 flex items-center justify-center rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </RadioGroupIndicator>
              </div>
              {creative.previewUrl && (
                <img
                  src={creative.previewUrl ?? ''}
                  alt={creative.name}
                  className="h-12 w-12 rounded-sm"
                />
              )}
              {!creative.previewUrl && <FileVideo size={50} />}
              <div className="text-left">
                <span className="font-medium">{creative.name}</span>
                <br />
                <span className="text-gray-500">
                  {formatMilliseconds(creative.durationMS ?? 0)}
                </span>
              </div>
            </RadioGroupItem>
          ))}
        </RadioGroupPrimitive>
      </CardContent>
    </>
  );
}
