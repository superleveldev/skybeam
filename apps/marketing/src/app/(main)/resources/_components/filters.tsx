'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@limelight/shared-ui-kit/ui/tabs';
import { useMemo } from 'react';

type Category = {
  _id: string;
  title: string | null;
};
type ResourceFilterProps = {
  categories: Category[];
};

const ViewAll: Category = { _id: 'View All', title: 'View All' };

export default function ResourceFilter({ categories }: ResourceFilterProps) {
  const categoriesList = useMemo(() => [ViewAll, ...categories], [categories]);
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const onFilter = (filter: string) => {
    const searchEntries = Array.from(searchParams.entries());
    const params = new URLSearchParams(searchEntries);
    if (filter === ViewAll.title) {
      params.delete('category');
    } else {
      params.set('category', filter);
    }
    replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      defaultValue={ViewAll.title!}
      className="w-full bg-transparent flex justify-center"
    >
      <TabsList
        className="
          rounded-none
          p-0
          flex
          justify-start
          pl-6
          tablet:pl-[152px]
          relative
          overflow-x-auto whitespace-nowrap
          scrollbar-hide
          mt-[-54px]
          bg-transparent
          w-full
          desktop:max-w-[1440px]
        "
      >
        {categoriesList.map((category) => (
          <TabsTrigger
            data-test-filter={category.title!}
            onClick={() => onFilter(category.title!)}
            key={category._id}
            value={category.title!}
            className="text-white font-semibold relative rounded-[8px] px-4 flex items-center 
                         data-[state=active]:bg-[rgba(128,179,255,0.5)]       
                         data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            {category.title!}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
