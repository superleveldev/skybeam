import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@limelight/shared-ui-kit/ui/accordion';
import { Checkbox } from '@limelight/shared-ui-kit/ui/checkbox';
import {
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@limelight/shared-ui-kit/ui/form';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import { Category, Segment } from '../_utils/index';
import { Control, ControllerRenderProps } from 'react-hook-form';
import { FormTargetingGroup } from '@limelight/shared-drizzle';
import { ChangeEvent, useCallback, useState } from 'react';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { formatToKMB } from '@limelight/shared-utils/index';

interface SelectedSegmentsProps {
  [key: string]: Segment[];
}
interface CategoriesAccordionProps {
  categories: Category[];
  control: Control<FormTargetingGroup>;
  selectedCategories?: SelectedSegmentsProps;
}

export default function CategoriesAccordion({
  categories,
  control,
  selectedCategories = {},
}: CategoriesAccordionProps) {
  const [selectedSegments, setSelectedSegments] =
    useState<SelectedSegmentsProps>(selectedCategories);
  const [displayedCategories, setDisplayedCategories] =
    useState<Category[]>(categories);

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value.toLowerCase();
      const filteredCategories = categories.map((category) => {
        return {
          ...category,
          segments: category.segments.filter((segment) =>
            segment.name.toLowerCase().includes(search),
          ),
        };
      });
      setDisplayedCategories(filteredCategories);
    },
    [categories],
  );

  const handleSelectSegment = useCallback(
    ({
      segment,
      field,
    }: {
      segment: Segment;
      field: ControllerRenderProps<FormTargetingGroup>;
    }) => {
      setSelectedSegments({
        ...selectedSegments,
        [segment.classification]: selectedSegments[segment.classification]
          ? [...selectedSegments[segment.classification], segment]
          : [segment],
      });
      field.onChange(
        field.value
          ? [...(field.value as string[]), segment.attribute_uuid]
          : [segment.attribute_uuid],
      );
    },
    [selectedSegments],
  );

  const handleRemoveSegment = useCallback(
    ({
      segment,
      field,
    }: {
      segment: Segment;
      field: ControllerRenderProps<FormTargetingGroup>;
    }) => {
      setSelectedSegments({
        ...selectedSegments,
        [segment.classification]: selectedSegments[
          segment.classification
        ].filter(
          (selectedSegment) =>
            segment.attribute_uuid !== selectedSegment.attribute_uuid,
        ),
      });
      field.onChange(
        (field.value as string[]).filter(
          (selectedCategory: string) =>
            segment.attribute_uuid !== selectedCategory,
        ),
      );
    },
    [selectedSegments],
  );

  return (
    <FormField
      control={control}
      name="categories"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base flex items-center gap-2">
            Categories
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>
                    Choose from predefined categories to reach viewers who are
                    likely to be interested in your product.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormDescription>
            Select from predefined audience categories to target viewers based
            on their behaviors or interests.
          </FormDescription>
          <FormControl>
            <>
              <Input
                onInput={handleSearch}
                placeholder="Search categories"
                type="search"
              />
              <Accordion className="border w-full" collapsible type="single">
                {displayedCategories.map((category: Category) => (
                  <AccordionItem
                    className="px-4"
                    key={category.name}
                    value={category.name}
                  >
                    <AccordionTrigger className="text-sm">
                      {category.name}{' '}
                      {selectedSegments[category.name]?.length > 0 &&
                        `(${selectedSegments[category.name].length})`}
                    </AccordionTrigger>
                    <AccordionContent className="max-h-[210px] overflow-y-scroll">
                      {category.segments.map((segment) => (
                        <div
                          className="flex justify-between w-3/4"
                          key={segment.name}
                        >
                          <div className="flex items-center space-x-2 py-1">
                            <Checkbox
                              checked={
                                !!field.value?.find(
                                  (selectedSegment) =>
                                    segment.attribute_uuid === selectedSegment,
                                )
                              }
                              id={segment.name}
                              onCheckedChange={(value) => {
                                // TODO: Refactor this to only use the form state as the source of truth
                                if (!value) {
                                  handleRemoveSegment({ segment, field });
                                  return;
                                }
                                handleSelectSegment({ segment, field });
                              }}
                            />
                            <label
                              className="font-medium leading-none text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor={segment.name}
                            >
                              {segment.name}
                            </label>
                          </div>
                          <span>
                            {formatToKMB(segment.beeswax_segment_count)}
                          </span>
                        </div>
                      ))}
                      {category.segments.length === 0 && (
                        <p className="text-sm">No segments found</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-4">
                <p className="text-sm">Included categories:</p>
                {Object.values(selectedSegments)
                  .flat()
                  .map((segment, index) => (
                    <span key={segment.attribute_uuid}>
                      {index !== 0 && (
                        <span className="px-1 text-xs"> OR </span>
                      )}
                      <Badge
                        key={segment.attribute_uuid}
                        onClick={() => handleRemoveSegment({ segment, field })}
                        role="button"
                        variant="secondary"
                      >
                        <span className="mr-2">{segment.name}</span>
                        <X size={12} />
                      </Badge>
                    </span>
                  ))}
                {Object.values(selectedSegments).length === 0 && (
                  <span className="text-sm">None</span>
                )}
              </div>
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
