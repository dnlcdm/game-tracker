import type { FC } from "react";
import type { RangeConfig } from "./filter-types";

const toEpochSeconds = (value: string) => {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";

  return String(Math.floor(date.getTime() / 1000));
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";

  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return "";
    return new Date(seconds * 1000).toISOString().slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
};

interface FilterRangeProps {
  range: RangeConfig;
  fromValue?: string;
  toValue?: string;
  onChange: (updates: { from?: string; to?: string }) => void;
}

export const FilterRange: FC<FilterRangeProps> = ({
  range,
  fromValue,
  toValue,
  onChange,
}) => {
  const inputType = range.mode === "date" ? "date" : "number";

  const formatValue = (value?: string) =>
    range.mode === "date" ? toDateInputValue(value) : value ?? "";

  const toParamValue = (value: string) =>
    range.mode === "date" ? toEpochSeconds(value) : value;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          De
          <input
            type={inputType}
            value={formatValue(fromValue)}
            min={range.min}
            max={range.max}
            step={range.step}
            placeholder={range.fromPlaceholder}
            onChange={(event) => onChange({ from: toParamValue(event.target.value) })}
            className="w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 transition-all font-mono focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Até
          <input
            type={inputType}
            value={formatValue(toValue)}
            min={range.min}
            max={range.max}
            step={range.step}
            placeholder={range.toPlaceholder}
            onChange={(event) => onChange({ to: toParamValue(event.target.value) })}
            className="w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 transition-all font-mono focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {range.helper && <p className="text-[11px] text-slate-500">{range.helper}</p>}
    </div>
  );
};
