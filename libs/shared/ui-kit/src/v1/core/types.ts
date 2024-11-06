export interface SearchParams extends Partial<Record<string, string>> {
  limit?: string | undefined;
  page?: string | undefined;
  search?: string | undefined;
  sort?: string | undefined;
  sortDir?: string | undefined;
}
