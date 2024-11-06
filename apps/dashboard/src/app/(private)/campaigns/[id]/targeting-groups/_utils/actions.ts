'use server';
import { api } from '../../../../../../trpc/server';

export async function fetchLocations({ search }: { search: string }) {
  return api.tinybird.geoTargetings.all.query({
    search,
  });
}

export async function fetchInventories() {
  return api.inventories.getInventories.query();
}
