import { ComboBoxMultiSelect } from '@limelight/shared-ui-kit/ui/combobox-multiselect';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Textarea } from '@limelight/shared-ui-kit/ui/textarea';
import { Control, useController, UseFormSetValue } from 'react-hook-form';
import { FormTargetingGroup } from '@limelight/shared-drizzle';
import { useCallback, useEffect, useState } from 'react';
import { fetchLocations, formatLabels, LocationOption } from '../_utils';
import { cn, debounce } from '@limelight/shared-utils/index';
import {
  RadioGroup,
  RadioGroupItem,
} from '@limelight/shared-ui-kit/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export interface LocationMultiselectProps {
  control: Control<FormTargetingGroup>;
  selectedLocations?: LocationOption[];
  selectedZipCodes?: string[];
  setValue: UseFormSetValue<FormTargetingGroup>;
}

export default function LocationMultiselect({
  control,
  selectedLocations = [],
  selectedZipCodes = [],
  setValue,
}: LocationMultiselectProps) {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [displayZipCodes, toggleDisplayZipCodes] = useState<boolean>(
    Boolean(selectedZipCodes.length),
  );

  const [displayedValues, setDisplayedValues] =
    useState<LocationOption[]>(selectedLocations);
  const handleValueChange = useCallback(
    (value: string) => {
      const isZipCodes = value === 'displayZipCodes';
      toggleDisplayZipCodes(isZipCodes);
      setValue(isZipCodes ? 'geoCities' : 'geoZipCodes', []);
      if (displayedValues.length) setDisplayedValues([]);
    },
    [displayedValues.length],
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      onChange: (value: string[]) => void,
    ) => {
      const zipCodes = e.target.value
        .split(',')
        .map((zip) => zip.trim())
        .filter((zip) => zip.length);
      onChange(zipCodes);
    },
    [],
  );

  useEffect(() => {
    if (selectedZipCodes.length) {
      toggleDisplayZipCodes(true);
    }
  }, [selectedZipCodes]);

  useEffect(() => {
    const getLocations = async () => {
      if (!search.length) return [];
      const data = await fetchLocations({ search });
      const formattedData = data.map((location) => ({
        label: formatLabels(location),
        value: location.geoname,
      }));
      setOptions(formattedData);
    };
    getLocations();
  }, [search]);

  const {
    fieldState: { error: geoZipCodesError },
  } = useController({
    control,
    name: 'geoZipCodes',
  });

  return (
    <FormItem>
      <FormLabel
        className={cn(
          geoZipCodesError ? 'text-destructive' : '',
          'text-lg flex items-center gap-2',
        )}
      >
        Location
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent align="start">
              <p>
                Increase relevance by targeting ads in specific areas where your
                audience is located.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </FormLabel>
      <FormDescription className="pb-2 text-sm text-gray-500">
        Target ads to specific locations by entering ZIP codes, cities, or
        states. Your campaign will be nationwide if no geographic locations are
        inputed.
      </FormDescription>
      <FormControl>
        <>
          <RadioGroup
            className="flex gap-2 text-sm"
            onValueChange={(value) => handleValueChange(value)}
            value={displayZipCodes ? 'displayZipCodes' : 'displayCitiesStates'}
          >
            <div className="flex gap-2">
              <RadioGroupItem
                id="displayCitiesStates"
                value="displayCitiesStates"
              />
              <FormLabel htmlFor="displayCitiesStates">
                Metros, Cities, States
              </FormLabel>
            </div>
            <div className="flex gap-2">
              <RadioGroupItem id="displayZipCodes" value="displayZipCodes">
                Zip Codes
              </RadioGroupItem>
              <FormLabel htmlFor="displayZipCodes">Zip Codes</FormLabel>
            </div>
          </RadioGroup>
          {displayZipCodes && (
            <FormField
              control={control}
              name="geoZipCodes"
              render={({ field }) => (
                <>
                  <Textarea
                    onInput={debounce((e) =>
                      handleInputChange(e, field.onChange),
                    )}
                    placeholder="Enter your zip codes as a comma-separated list"
                    defaultValue={field.value?.join(',')}
                  />
                  <FormMessage />
                </>
              )}
            />
          )}
          {!displayZipCodes && (
            <FormField
              control={control}
              name="geoCities"
              render={({ field }) => (
                <ComboBoxMultiSelect
                  displayedValues={displayedValues}
                  onChange={(values) => {
                    field.onChange(values.map((v) => v.value));
                    setDisplayedValues(values);
                  }}
                  onInput={debounce((e) => setSearch(e.target.value))}
                  options={options}
                  value={field.value}
                />
              )}
            />
          )}
        </>
      </FormControl>
    </FormItem>
  );
}
