import { useState, type FC } from "react";
import type {
  FilterGroup as FilterGroupType,
  FilterState,
} from "./filter-types";
import { FilterGroup } from "./filter-group";
import { MobileFilterDrawer } from "./mobile-filter-drawer";

interface FilterSidebarProps {
  groups: FilterGroupType[];
  filters: FilterState;
  hasChanges: boolean;
  activeCount: number;
  draftCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onUpdateFilter: (
    group: FilterGroupType,
    value: string,
    checked: boolean,
  ) => void;
  onUpdateRange: (
    group: FilterGroupType,
    updates: { from?: string; to?: string },
  ) => void;
  onApply: () => void;
  onClear: () => void;
  onReset: () => void;
}

export const FilterSidebar: FC<FilterSidebarProps> = ({
  groups,
  filters,
  hasChanges,
  activeCount,
  draftCount,
  isMobileOpen,
  onCloseMobile,
  onUpdateFilter,
  onUpdateRange,
  onApply,
  onReset,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = isMobileOpen ?? internalIsOpen;
  const closeMobile = onCloseMobile ?? (() => setInternalIsOpen(false));

  const handleApply = () => {
    onApply();
    closeMobile();
  };

  const handleReset = () => {
    onReset();
    closeMobile();
  };

  const canApply = hasChanges || draftCount !== activeCount;

  return (
    <>
      <MobileFilterDrawer
        isOpen={isOpen}
        onClose={closeMobile}
        draftCount={draftCount}
        onClear={onReset}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-3">
            {groups.map((group) => (
              <FilterGroup
                key={group.id}
                group={group}
                filters={filters}
                onUpdateFilter={(value, checked) =>
                  onUpdateFilter(group, value, checked)
                }
                onUpdateRange={(updates) => onUpdateRange(group, updates)}
              />
            ))}
          </div>

          <div className="safe-pb z-50 flex shrink-0 justify-between border-t border-slate-800 pb-8 pt-4 lg:border-none lg:pb-0 lg:pt-0">
            <button
              className={`
                mt-3 w-auto rounded-full px-4 py-3 text-xs font-semibold shadow-lg transition-all sm:hidden sm:rounded-sm
                ${draftCount > 0
                  ? "bg-blue-600 text-white ring-1 ring-blue-400/50 shadow-blue-500/20 hover:bg-blue-500"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }
              `}
              disabled={draftCount === 0}
              onClick={handleReset}
            >
              Redefinir
            </button>

            <button
              onClick={handleApply}
              disabled={!canApply}
              className={`
                mt-3 w-1/2 rounded-full px-4 py-3 text-nowrap text-xs font-semibold shadow-lg transition-all sm:w-full sm:rounded-sm
                ${canApply
                  ? "bg-blue-600 text-white ring-1 ring-blue-400/50 shadow-blue-500/20 hover:bg-blue-500"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }
              `}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </MobileFilterDrawer>
    </>
  );
};
