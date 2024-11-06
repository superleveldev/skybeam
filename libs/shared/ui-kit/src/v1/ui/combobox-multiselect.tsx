'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@limelight/shared-utils/index';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Badge } from './badge';

export interface Option {
  label: string;
  value: string;
}

export function ComboBoxMultiSelect({
  displayedValues,
  onChange,
  onInput,
  options,
  value = [],
}: {
  displayedValues: Option[];
  onChange: (value: Option[]) => void;
  onInput: React.ChangeEventHandler<HTMLInputElement>;
  options: Option[];
  value: string[] | undefined;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSetValue = React.useCallback(
    (data: Option) => {
      if (value.includes(data.value)) {
        onChange(displayedValues.filter(({ value }) => value !== data.value));
      } else {
        onChange([...displayedValues, data]);
      }
    },
    [value],
  );
  return (
    <Command shouldFilter={false}>
      <div className="border rounded-md">
        <CommandInput
          ref={inputRef}
          className="bg-transparent flex h-11 outline-none rounded-md text-sm w-full disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground"
          onInput={onInput}
          placeholder="Search..."
        />
        <CommandList>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="flex-wrap">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSetValue(option)}
                value={option.value}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value.includes(option.value) ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </div>
      <div className="border flex flex-wrap gap-2 h-full items-start justify-start max-h-[210px] mt-2 overflow-y-scroll p-2 rounded-md text-sm">
        {displayedValues.length ? (
          displayedValues.map((val, i) => (
            <Badge
              className="bg-gray-200 hover:bg-gray-200 gap-1"
              key={i}
              onClick={() => handleSetValue(val)}
              role="button"
              variant="secondary"
            >
              {val.label}
              <X size={12} />
            </Badge>
          ))
        ) : (
          <span className="cursor-default text-muted-foreground">
            None selected
          </span>
        )}
      </div>
    </Command>
  );
}
