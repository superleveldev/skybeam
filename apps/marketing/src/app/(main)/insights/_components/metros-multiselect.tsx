import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@limelight/shared-ui-kit/ui/form';
import { useState } from 'react';
import { debounce } from '@limelight/shared-utils/debounce/debounce';
import { Option } from './badged-multiselect';
import { BadgedMultiSelect } from './badged-multiselect';
import { useFormContext } from 'react-hook-form';
import { api } from '../../../../trpc/react';
import { mapToLabelName } from '../_utils';
import { Button } from '@limelight/shared-ui-kit/ui/button';

export type MetrosMultiselectProps = {
  selectedMetros?: Option[];
};

export default function MetrosMultiselect() {
  const { control, watch, setValue } = useFormContext();
  const [search, setSearch] = useState('');
  const [displayedValues, setDisplayedValues] = useState<Option[]>([]);
  const selectedMetros = watch('locations');

  const { data: options } = api.impressionForecaster.dmaStateLookup.useQuery(
    {
      search,
    },
    {
      enabled: search.length > 0,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );

  const clearAll = () => {
    setValue('locations', [], { shouldValidate: true });
    setDisplayedValues([]);
  };

  return (
    <FormItem>
      <FormLabel className="text-base flex items-center gap-2 text-muted-foreground font-[400]">
        Location
      </FormLabel>
      <FormControl>
        <FormField
          control={control}
          name="locations"
          render={({ field }) => (
            <BadgedMultiSelect
              placeholder="Search metro areas..."
              displayedValues={displayedValues}
              noResultsText="No metros found."
              onChange={(values) => {
                field.onChange(values.map((v) => v.value));
                setDisplayedValues(values);
              }}
              onInput={debounce((e) => setSearch(e.target.value))}
              options={mapToLabelName(options ?? [])}
              value={field.value}
            />
          )}
        />
      </FormControl>
      <p
        className={`text-[0.75rem] ${
          selectedMetros.length > 10 ? 'text-red-500' : 'text-[#737C8B]'
        } leading-[1] pt-1.5 pb-0 flex items-center justify-between`}
      >
        {selectedMetros.length < 10
          ? `Select at least one location to calculate. You can add ${
              10 - selectedMetros.length
            } more area${10 - selectedMetros.length > 1 ? 's' : ''}.`
          : selectedMetros.length === 10
          ? 'You can’t add more metro areas'
          : 'You cannot select more than 10 metros'}

        {selectedMetros.length > 0 && (
          <Button
            variant="link"
            onClick={clearAll}
            className="hover:underline ml-2"
          >
            Clear all
          </Button>
        )}
      </p>
    </FormItem>
  );
}
