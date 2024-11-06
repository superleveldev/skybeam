'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { cn, debounce, getParams } from '@limelight/shared-utils/index';
import { Search as SearchIcon } from 'lucide-react';
import { SearchParams } from './types';

interface SearchProps {
  className?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchParams: SearchParams;
}

export default function Search({ searchParams, ...attrs }: SearchProps) {
  const { className, onChange, placeholder, ...restAttrs } = attrs;
  const { sort, sortDir, ...restParams } = searchParams;
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchParams.search ?? '');

  const _updateSearch = useCallback(
    debounce((value: string) => {
      if (onChange) {
        onChange(value);
      } else {
        const params = getParams({
          ...restParams,
          search: value,
          sort,
          sortDir,
        });

        router.replace(`${pathname}?${new URLSearchParams(params)}`);
      }
    }),
    [router, pathname, sort, sortDir, restParams],
  );

  useEffect(() => {
    _updateSearch(search);
  }, [search]);

  return (
    <div {...restAttrs} className={cn(className, 'relative w-full')}>
      <SearchIcon className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
      <Input
        className="pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setSearch(event.target.value)
        }
        placeholder={placeholder || 'Search...'}
        type="search"
        value={search}
      />
    </div>
  );
}
