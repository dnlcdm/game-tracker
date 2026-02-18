import type { FC } from "react";
import type { FilterOption, FilterType } from "./filter-types";

type SelectFilterType = Extract<FilterType, "single" | "multi">;

interface FilterListProps {
  type: SelectFilterType;
  groupId: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

export const FilterList: FC<FilterListProps> = ({
  type,
  groupId,
  options,
  selectedValues,
  onChange,
}) => {
  const listClass =
    options.length > 6
      ? "max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700"
      : "space-y-2";

  return (
    <div className={listClass}>
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);

        return (
          <label
            key={option.id}
            className="group/item flex cursor-pointer items-center justify-between gap-2 text-xs text-slate-300 transition-colors hover:text-white"
          >
            <span className="flex items-center gap-3">
              <span className="relative flex items-center">
                <input
                  type={type === "multi" ? "checkbox" : "radio"}
                  name={`filter-${groupId}`}
                  checked={isChecked}
                  onChange={(event) => onChange(option.value, event.target.checked)}
                  className="peer h-4 w-4 appearance-none rounded border border-slate-600 bg-slate-900/60 transition-all checked:border-blue-500 checked:bg-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="transition-colors group-hover/item:text-blue-200">
                {option.label}
              </span>
            </span>
            {option.count !== undefined && (
              <span className="text-xs text-slate-500">{option.count}</span>
            )}
          </label>
        );
      })}
    </div>
  );
};
