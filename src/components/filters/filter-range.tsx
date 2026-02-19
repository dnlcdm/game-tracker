import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import type { RangeConfig } from "./filter-types";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ptBR } from "date-fns/locale";

const pickerTextFieldSx = {
  width: "100%",
  "& .MuiPickersInputBase-root": {
    backgroundColor: "rgba(15, 23, 42, 0.40)",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    color: "#e2e8f0",
    transition: "all 150ms ease",
    fontSize: "12px",
    height: "38px"
  },

  "& .MuiIconButton-root": {
    color: "#94a3b8",
  },

  "& .MuiPickersSectionList-section": {
    color: "#ffffffff",
    fontFamily: "BHHBogle",
  }
};
const pickerPopperSx = {
  "& .MuiPaper-root": {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    border: "1px solid #1e293b",
  },
  "& .MuiIconButton-root": { color: "#cbd5e1", height: "auto" },
  "& .Mui-selected": {
    backgroundColor: "#3b82f6 !important",
    borderRadius: "4px",
    color: "#fff !important",
  },
  "& .MuiMonthCalendar-button:hover, & .MuiYearCalendar-button:hover": {
    border: "1px solid #3b82f6 !important",
    borderRadius: "4px",
  }
};

const pickerDialogSx = {
  "& .MuiPaper-root": {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    backgroundImage: "none",
    border: "1px solid #1e293b",
  },
  "& .MuiPickersToolbar-root": {
    backgroundColor: "#1e293b",
    "& .MuiTypography-root": { color: "#e2e8f0" },
  },
  "& .MuiDialogActions-root": {
    backgroundColor: "#0f172a",
    "& .MuiButton-root": { color: "#3b82f6" },
  },
  "& .MuiTypography-root": { color: "#e2e8f0" },
  "& .MuiPickersYear-yearButton": { color: "#cbd5e1" },
  "& .MuiPickersMonth-monthButton": { color: "#cbd5e1" },
  "& .Mui-selected": {
    backgroundColor: "#3b82f6 !important",
    color: "#fff !important",
  },
};

const isValidDate = (d: Date) => !Number.isNaN(d.getTime());

const parseParamToDate = (value?: string): Date | null => {
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return null;
    const utcDate = new Date(seconds * 1000);
    if (!isValidDate(utcDate)) return null;

    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
  }

  const d = new Date(value);
  return isValidDate(d) ? d : null;
};

const toPickerMonthStart = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

const toMonthStartUtc = (d: Date): Date =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1, 0, 0, 0));

const toEpochSeconds = (date: Date | null) => {
  if (!date) return "";
  const normalized = toMonthStartUtc(date);
  return String(Math.floor(normalized.getTime() / 1000));
};

const toMonthEndEpoch = (date: Date | null) => {
  if (!date) return "";
  const lastDayUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));
  return String(Math.floor(lastDayUtc.getTime() / 1000));
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
  const inputClassName =
    "w-full bg-slate-900/40 backdrop-blur-md border border-white text-sm text-slate-200 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 shadow-lg font-mono";

  if (range.mode !== "date") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          <label className="flex flex-col gap-2 text-xs font-medium text-slate-400">
            De
            <input
              type="number"
              value={fromValue ?? ""}
              min={range.min}
              max={range.max}
              placeholder={range.fromPlaceholder}
              onChange={(e) => onChange({ from: e.target.value })}
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-medium text-slate-400">
            Até
            <input
              type="number"
              value={toValue ?? ""}
              min={range.min}
              max={range.max}
              placeholder={range.toPlaceholder}
              onChange={(e) => onChange({ to: e.target.value })}
              className={inputClassName}
            />
          </label>
        </div>

        {range.helper && (
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {range.helper}
          </p>
        )}
      </div>
    );
  }
  const getPickerValue = useCallback((v: unknown): Date | null => {
    const raw = parseParamToDate(String(v));
    return raw ? toPickerMonthStart(raw) : null;
  }, []);

  const minRaw = useMemo(() => parseParamToDate(String(range.min)), [range.min]);
  const maxRaw = useMemo(() => parseParamToDate(String(range.max)), [range.max]);

  const minDate = useMemo(
    () => (minRaw ? toPickerMonthStart(minRaw) : undefined),
    [minRaw]
  );
  const maxDate = useMemo(
    () => (maxRaw ? toPickerMonthStart(maxRaw) : undefined),
    [maxRaw]
  );

  const [pickerFrom, setPickerFrom] = useState<Date | null>(() =>
    getPickerValue(fromValue)
  );
  const [pickerTo, setPickerTo] = useState<Date | null>(() =>
    getPickerValue(toValue)
  );

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  useEffect(() => setPickerFrom(getPickerValue(fromValue)), [fromValue, getPickerValue]);
  useEffect(() => setPickerTo(getPickerValue(toValue)), [toValue, getPickerValue]);

  const handleFromChange = useCallback(
    (newValue: Date | null) => {
      const normalized = newValue ? toPickerMonthStart(newValue) : null;
      setPickerFrom(normalized);
      onChange({ from: normalized ? toEpochSeconds(normalized) : undefined });
    },
    [onChange]
  );

  const handleToChange = useCallback(
    (newValue: Date | null) => {
      const normalized = newValue ? toPickerMonthStart(newValue) : null;
      setPickerTo(normalized);
      onChange({ to: normalized ? toMonthEndEpoch(normalized) : undefined });
    },
    [onChange]
  );

  const fromMaxDate = pickerTo ?? maxDate;
  const toMinDate = pickerFrom ?? minDate;

  const openNextTick = (fn: () => void) => {
    window.setTimeout(fn, 0);
  };
  const makeLockedFieldProps = (openFn: () => void) => ({
    fullWidth: true,
    sx: pickerTextFieldSx,

    inputProps: {
      readOnly: true,
      inputMode: "none" as const,
      tabIndex: -1,
    },
    onKeyDown: (e: React.KeyboardEvent) => e.preventDefault(),
    onPaste: (e: React.ClipboardEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => e.preventDefault(),

    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },

    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openNextTick(openFn);
    },

    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      (e.target as HTMLInputElement).blur();
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <label className="flex flex-col gap-2 text-xs font-medium text-slate-400">
            De
            <DatePicker
              views={["year", "month"]}
              openTo="month"
              value={pickerFrom}
              onChange={handleFromChange}
              format="MM/yyyy"
              minDate={minDate}
              maxDate={fromMaxDate}
              closeOnSelect
              open={openFrom}
              onOpen={() => setOpenFrom(true)}
              onClose={() => setOpenFrom(false)}
              slotProps={{
                textField: makeLockedFieldProps(() => setOpenFrom(true)),
                popper: { sx: pickerPopperSx },
                dialog: { sx: pickerDialogSx },
              }}
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-medium text-slate-400">
            Até
            <DatePicker
              views={["year", "month"]}
              openTo="month"
              value={pickerTo}
              onChange={handleToChange}
              format="MM/yyyy"
              minDate={toMinDate}
              maxDate={maxDate}
              closeOnSelect
              open={openTo}
              onOpen={() => setOpenTo(true)}
              onClose={() => setOpenTo(false)}
              slotProps={{
                textField: makeLockedFieldProps(() => setOpenTo(true)),
                popper: { sx: pickerPopperSx },
                dialog: { sx: pickerDialogSx },
              }}
            />
          </label>
        </div>

        {range.helper && (
          <p className="text-[11px] text-slate-500 leading-relaxed">{range.helper}</p>
        )}
      </div>
    </LocalizationProvider>
  );
};
