export function getParams<
  T extends Partial<Record<string, string>> = Partial<Record<string, string>>,
>({
  limit = '10',
  page = '1',
  search = '',
  sort = '',
  sortDir = '',
  ...rest
}: {
  limit?: string;
  page?: string;
  search?: string;
  sort?: string;
  sortDir?: string;
} & T) {
  const sortParam = sortDir === 'asc' ? sort : `-${sort}`;
  return {
    limit,
    page,
    search,
    sort: sort ? sortParam : '',
    ...rest,
  };
}
