import { type JSX, type KeyboardEvent, type ReactNode } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { FinishGameFormData } from "../types";

export type IconComponent = (props: {
  size?: number;
  className?: string;
}) => JSX.Element;

interface FieldWrapperProps {
  label: string;
  icon?: IconComponent;
  children: ReactNode;
  error?: string;
}

export const FieldWrapper = ({
  label,
  icon: Icon,
  children,
  error,
}: FieldWrapperProps) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
      {Icon && <Icon size={12} className="text-blue-500" />}
      {label}
    </label>
    {children}
    {error && (
      <span className="text-[10px] absolute text-red-500 text-nowrap font-medium">
        {error}
      </span>
    )}
  </div>
);

export const TimeInputField = () => {
  const { control } = useFormContext<FinishGameFormData>();

  const handleNumericKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    if (allowedControlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-4 w-full">
      <Controller
        name="hours_played.hours"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldWrapper label="Horas" error={error?.message}>
            <div className="relative group">
              <input
                {...field}
                value={field.value ?? ""}
                type="number"
                onChange={(e) => {
                  let raw = e.target.value;

                  raw = raw.replace(/\D/g, "");
                  raw = raw.slice(0, 6);

                  field.onChange(raw === "" ? "" : Number(raw));
                }}
                inputMode="numeric"
                onKeyDown={handleNumericKeyDown}
                placeholder="00"
                className=" [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white/5 border border-white/10 rounded-lg ml px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 pointer-events-none group-focus-within:text-blue-500">
                H
              </span>
            </div>
          </FieldWrapper>
        )}
      />

      <Controller
        name="hours_played.minutes"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldWrapper label="Minutos" error={error?.message}>
            <div className="relative group">
              <input
                {...field}
                value={field.value}
                onChange={(e) => {
                  let raw = e.target.value;

                  raw = raw.replace(/\D/g, "");
                  raw = raw.slice(0, 2);

                  field.onChange(raw === "" ? "" : Number(raw));
                }}
                onBlur={(e) => {
                  let val = Number(e.target.value);

                  if (Number.isNaN(val) || val < 0) val = 0;
                  if (val > 59) val = 59;

                  field.onChange(val);
                  field.onBlur();
                }}
                type="number"
                inputMode="numeric"
                onKeyDown={handleNumericKeyDown}
                placeholder="00"
                className=" [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white/5 border border-white/10 rounded-lg ml px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 pointer-events-none group-focus-within:text-blue-500">
                M
              </span>
            </div>
          </FieldWrapper>
        )}
      />
    </div>
  );
};
