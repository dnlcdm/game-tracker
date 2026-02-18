import type { FC } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FilterGroup as FilterGroupType, FilterState } from "./filter-types";
import { FilterRange } from "./filter-range";
import { FilterList } from "./filter-list";
import {
  getGroupSelectedCount,
  splitFilterValues,
} from "./filter-state.utils";

interface FilterGroupProps {
  group: FilterGroupType;
  filters: FilterState;
  onUpdateFilter: (value: string, checked: boolean) => void;
  onUpdateRange: (updates: { from?: string; to?: string }) => void;
}

export const FilterGroup: FC<FilterGroupProps> = ({
  group,
  filters,
  onUpdateFilter,
  onUpdateRange,
}) => {
  const selectedValues = splitFilterValues(filters[group.paramKey]);
  const selectedCount = getGroupSelectedCount(filters, group);

  return (
    <details
      open={group.defaultOpen}
      className="group rounded-xs border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-lg"
    >
      <summary className="flex items-center justify-between rounded-t-xs bg-slate-900/20 px-4 py-3 text-xs text-slate-200 transition-colors list-none cursor-pointer hover:bg-slate-800/40 group-open:rounded-b-none lg:py-2 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-medium">
          {group.title}
          {selectedCount > 0 && (
            <span className="min-w-[1.25rem] rounded-full bg-blue-500 px-1.5 py-0.5 text-center text-[10px] text-white">
              {selectedCount}
            </span>
          )}
        </span>
        <ExpandMoreIcon className="text-slate-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-800/70 p-4 pt-3 text-xs text-slate-300">
        {group.type === "range" && group.range ? (
          <FilterRange
            range={group.range}
            fromValue={filters[group.range.fromParam]}
            toValue={filters[group.range.toParam]}
            onChange={onUpdateRange}
          />
        ) : (
          <FilterList
            type={group.type === "single" ? "single" : "multi"}
            groupId={group.id}
            options={group.options}
            selectedValues={selectedValues}
            onChange={onUpdateFilter}
          />
        )}
      </div>
    </details>
  );
};
