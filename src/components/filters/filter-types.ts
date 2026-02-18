export type FilterType = "single" | "multi" | "range";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface RangeConfig {
  fromParam: string;
  toParam: string;
  mode?: "number" | "date";
  min?: number;
  max?: number;
  step?: number;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  helper?: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  paramKey: string;
  type: FilterType;
  options: FilterOption[];
  range?: RangeConfig;
  defaultOpen?: boolean;
}

export type FilterState = Record<string, string>;
