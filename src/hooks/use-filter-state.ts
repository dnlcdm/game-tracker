import { useState, useMemo, useCallback, useEffect } from "react";
import type { FilterGroup, FilterState } from "../components/filters/filter-types";
import {
  areFilterStatesEqual,
  clearFilterGroups,
  countSelectedFilters,
  updateOptionFilter,
  updateRangeFilter,
} from "../components/filters/filter-state.utils";

export const useFilterState = (initialState: FilterState = {}) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  useEffect(() => {
    setFilters(initialState);
  }, [initialState]);

  const countActiveFilters = useCallback(
    (groups: FilterGroup[]) => countSelectedFilters(filters, groups),
    [filters],
  );

  const updateFilter = useCallback(
    (group: FilterGroup, optionValue: string, isChecked: boolean) => {
      setFilters((prev) => updateOptionFilter(prev, group, optionValue, isChecked));
    },
    [],
  );

  const updateRange = useCallback(
    (group: FilterGroup, updates: { from?: string; to?: string }) => {
      setFilters((prev) => updateRangeFilter(prev, group, updates));
    },
    [],
  );

  const clearFilters = useCallback((groups: FilterGroup[]) => {
    setFilters((prev) => clearFilterGroups(prev, groups));
  }, []);

  const hasChanges = useMemo(
    () => !areFilterStatesEqual(filters, initialState),
    [filters, initialState],
  );

  return {
    filters,
    setFilters,
    updateFilter,
    updateRange,
    clearFilters,
    countActiveFilters,
    hasChanges,
  };
};
