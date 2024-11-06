import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@limelight/shared-ui-kit/ui/form';
import { Control } from 'react-hook-form';
import { FormTargetingGroup } from '@limelight/shared-drizzle';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@limelight/shared-ui-kit/ui/command';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { fetchInventories } from '../_utils/actions';
import { debounce } from '@limelight/shared-utils/index';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import ShowAllButton from '../../../_components/CampaignSummary/ShowAllButton';

interface InventoriesProps {
  control: Control<FormTargetingGroup>;
  isDisabled?: boolean;
}

export default function Inventories({
  control,
  isDisabled = false,
}: InventoriesProps) {
  const [allInventories, setAllInventories] = useState<
    { id: string; name: string }[]
  >([]);
  const [displayedInventories, setDisplayedInventories] = useState<
    { id: string; name: string }[]
  >([]);

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value.toLowerCase();
      const filteredInventories = allInventories.filter((inventory) =>
        inventory.name.toLowerCase().includes(search),
      );
      setDisplayedInventories(filteredInventories);
    },
    [allInventories],
  );

  useEffect(() => {
    const getInventories = async () => {
      const data = await fetchInventories();
      const formattedData = data.map((inventory) => ({
        id: `${inventory.beeswaxListId}`,
        name: inventory.name,
      }));
      setAllInventories(formattedData);
      setDisplayedInventories(formattedData);
    };

    getInventories();
  }, []);

  return (
    <FormField
      control={control}
      name="inventories"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-2 font-medium flex flex-row items-center justify-start gap-2 text-lg">
            Inventory
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>
                    Maximize exposure by selecting premium streaming platforms
                    that align with your audience's viewing habits.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          {!isDisabled && (
            <FormDescription className="py-1 my-1">
              Choose streaming platforms to display your ads on.
            </FormDescription>
          )}
          <FormControl>
            <>
              {isDisabled && (
                <div className="mb-6">
                  <ShowAllButton>
                    {allInventories.map((inventory) => (
                      <Badge
                        className="mr-1"
                        key={inventory.id}
                        variant="secondary"
                      >
                        {inventory.name}
                      </Badge>
                    ))}
                  </ShowAllButton>
                </div>
              )}
              {!isDisabled && (
                <div className="mb-6">
                  <Input
                    className="mb-2"
                    onInput={debounce(handleInput, 500)}
                    placeholder="Search inventories"
                    type="search"
                  />
                  <div className="flex mb-1">
                    <div className="flex justify-between text-xs w-1/2">
                      <span className="font-medium">
                        Available Inventory ({allInventories.length})
                      </span>
                      <span
                        className="pr-2 text-primary"
                        onClick={() =>
                          field.onChange(allInventories.map(({ id }) => id))
                        }
                        role="button"
                      >
                        Select All
                      </span>
                    </div>
                    <div className="flex justify-between text-xs w-1/2">
                      <span className="font-medium">
                        Selected Inventory ({field.value?.length ?? 0})
                      </span>
                      <span
                        className="pr-2 text-primary"
                        onClick={() => field.onChange([])}
                        role="button"
                      >
                        Clear All
                      </span>
                    </div>
                  </div>
                  <Command className="border">
                    <div className="flex">
                      <CommandList className="border-r-2 w-1/2">
                        <CommandGroup>
                          {displayedInventories.map((inventory) => (
                            <CommandItem
                              className={
                                field.value?.includes(inventory.id)
                                  ? 'bg-gray-200 hover:bg-gray-200 rounded-none'
                                  : ''
                              }
                              key={inventory.id}
                              onSelect={() => {
                                if (!field.value?.includes(inventory.id)) {
                                  field.onChange([
                                    ...(field.value ?? []),
                                    inventory.id,
                                  ]);
                                }
                              }}
                            >
                              {inventory.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      <CommandList className="w-1/2">
                        <CommandGroup>
                          {allInventories
                            .filter((inventory) =>
                              (field.value ?? []).includes(inventory.id),
                            )
                            .map((inventory) => {
                              return (
                                <CommandItem
                                  key={inventory?.id}
                                  onSelect={() => {
                                    field.onChange(
                                      (field.value ?? []).filter(
                                        (id) => id !== inventory?.id,
                                      ),
                                    );
                                  }}
                                  value={inventory?.id}
                                >
                                  {inventory?.name}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </div>
                  </Command>
                </div>
              )}
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
