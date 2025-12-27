import { Controller, useFormContext } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FinishGameFormData } from "../types";
import { FieldWrapper, type IconComponent } from "./time-input-field";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: "platform_used" | "completion_type";
  label: string;
  options: SelectOption[];
  icon?: IconComponent;
}

export const CustomSelect = ({
  name,
  label,
  options,
  icon: Icon,
}: CustomSelectProps) => {
  const { control } = useFormContext<FinishGameFormData>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldWrapper label={label} icon={Icon} error={error?.message}>
          <div className="relative group">
            <select
              {...field}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="" disabled className="bg-gray-900">
                Selecione...
              </option>
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-gray-900"
                >
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
              <ExpandMoreIcon />
            </div>
          </div>
        </FieldWrapper>
      )}
    />
  );
};
