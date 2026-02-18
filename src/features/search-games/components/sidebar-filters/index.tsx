import { useCallback, useMemo, type FC } from "react";
import { FilterSidebar } from "../../../../components/filters/filter-sidebar";
import {
  clearFilterGroups,
  countSelectedFilters,
} from "../../../../components/filters/filter-state.utils";
import { useFilterState } from "../../../../hooks/use-filter-state";
import { useDataGame } from "../../hooks/useDataGames";
import { FILTER_GROUPS } from "./filter-definitions";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const SidebarFilters: FC = () => {
  const { params, setParams } = useDataGame();

  const { filters, setFilters, updateFilter, updateRange, clearFilters, hasChanges } =
    useFilterState(params);

  const handleApply = useCallback(() => {
    setParams(filters);
    scrollToTop();
  }, [filters, setParams]);

  const handleClear = useCallback(() => {
    clearFilters(FILTER_GROUPS);
  }, [clearFilters]);

  const handleReset = useCallback(() => {
    const nextFilters = clearFilterGroups(filters, FILTER_GROUPS);
    setFilters(nextFilters);
    setParams(nextFilters);
    scrollToTop();
  }, [filters, setFilters, setParams]);

  const activeCount = useMemo(
    () => countSelectedFilters(params, FILTER_GROUPS),
    [params],
  );

  const draftCount = useMemo(
    () => countSelectedFilters(filters, FILTER_GROUPS),
    [filters],
  );

  return (
    <FilterSidebar
      groups={FILTER_GROUPS}
      filters={filters}
      hasChanges={hasChanges}
      activeCount={activeCount}
      draftCount={draftCount}
      onUpdateFilter={updateFilter}
      onUpdateRange={updateRange}
      onApply={handleApply}
      onClear={handleClear}
      onReset={handleReset}
    />
  );
};
