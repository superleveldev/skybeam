import { Segment, TargetingSegment } from './index';

export function formatCategories(categories: TargetingSegment[]) {
  return categories.reduce(
    (acc: { [key: string]: Segment[] }, currentAttribute) => {
      const { attribute_uuid, beeswax_segment_count, classification, name } =
        currentAttribute;
      if (classification === 'Age' || classification === 'Gender') return acc;
      if (!acc[classification]) {
        acc[classification] = [];
      }
      acc[classification].push({
        attribute_uuid,
        beeswax_segment_count,
        classification,
        name,
      });
      return acc;
    },
    {},
  );
}

export function formatCategoriesArray(categories: TargetingSegment[]) {
  const formattedCategories = formatCategories(categories);
  return Object.entries(formattedCategories).map(([key, value]) => ({
    name: key,
    segments: value,
  }));
}

export function formatLabels(location: { name: string; region_name: string }) {
  return location.name && location.region_name
    ? `${location.name}, ${location.region_name}`
    : location.name || location.region_name;
}

export function formatSummaryData(segments: TargetingSegment) {}
