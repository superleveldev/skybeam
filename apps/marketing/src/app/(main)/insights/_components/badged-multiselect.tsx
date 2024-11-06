import { Button } from '@limelight/shared-ui-kit/ui/button';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@limelight/shared-ui-kit/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@limelight/shared-ui-kit/ui/popover';
import { cn } from '@limelight/shared-utils/index';
import { Check, X, Search } from 'lucide-react';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import { ChangeEventHandler, useCallback, useState } from 'react';

export type Option = {
  label: string;
  value: string;
  id: string;
};

type BadgedMultiSelectProps = {
  displayedValues: Option[];
  onChange: (value: Option[]) => void;
  onInput: ChangeEventHandler<HTMLInputElement>;
  options: Option[];
  value: string[] | undefined;
  placeholder?: string;
  noResultsText?: string;
};

export function BadgedMultiSelect({
  displayedValues,
  onChange,
  onInput,
  options,
  value = [],
  placeholder = 'Select option...',
  noResultsText = 'No results found.',
}: BadgedMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSetValue = useCallback(
    (data: Option) => {
      if (value.includes(data.value)) {
        onChange(displayedValues.filter(({ value }) => value !== data.value));
      } else {
        onChange([...displayedValues, data]);
      }
    },
    [value, displayedValues, onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-test-metro-area-button
          aria-expanded={open}
          className="h-full items-start justify-start align-center w-full"
          role="combobox"
          variant="outline"
        >
          <div className="h-full flex items-start justify-start desktop:w-[520px] space-x-2 flex-wrap">
            {displayedValues.length ? (
              displayedValues.map((val, i) => (
                <Badge
                  key={val.value}
                  variant="outline"
                  className="border mb-2 border-[#C9D6D7] items-center text-[#192F44] text-[15px] leading-[1.4] font-proximaNova font-semibold rounded-md px-2 py-0 w-fit"
                >
                  {val.label}
                  <span
                    className="flex items-center hover:bg-accent hover:text-accent-foreground pr-0 pl-2 py-0 h-4"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSetValue(val);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSetValue(val);
                    }}
                  >
                    <X className="h-[12px] w-[12px] text-[#737C8B] hover:text-foreground background-[#fff]" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="flex items-center justify-start text-center">
                <Search className="h-[20px] w-[20px]" />
                <span className="pl-3">{placeholder}</span>
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]"
      >
        <Command shouldFilter={false}>
          <CommandInput
            data-test-metro-area-search
            onInput={onInput}
            placeholder="Search..."
          />

          <div className="overflow-y-hidden">
            <CommandList className="max-h-[275px]">
              <CommandEmpty>{noResultsText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    data-test-metro-area-item
                    key={option.id}
                    onSelect={() => handleSetValue(option)}
                    value={option.value}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(option.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
