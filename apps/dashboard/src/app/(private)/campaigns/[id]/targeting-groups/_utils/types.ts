export interface Category {
  name: string;
  segments: Segment[];
}

export interface LocationOption {
  label: string;
  value: string;
}

export interface Segment {
  attribute_uuid: string;
  beeswax_segment_count: number;
  classification: string;
  name: string;
}

export interface TargetingSegment {
  attribute_uuid: string;
  beeswax_segment_id: string;
  beeswax_segment_count: number;
  classification: string;
  name: string;
}
