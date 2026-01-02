import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Rating, { type IconContainerProps } from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import type { FinishGameFormData } from "../types";
import { FieldWrapper } from "./time-input-field";
import { DIFFICULTY_CONFIG } from "../contants/fields.constants";

export const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{DIFFICULTY_CONFIG[value].icon}</span>;
}

export const DifficultyInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FinishGameFormData>();
  const [hover, setHover] = useState<number>(-1);

  const currentValue =
    useWatch<FinishGameFormData, "difficult">({
      control,
      name: "difficult",
    }) || 0;

  const displayValue = hover !== -1 ? hover : currentValue;
  const fieldError = errors.difficult?.message;

  return (
    <FieldWrapper label="Dificuldade" error={fieldError}>
      <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <Controller<FinishGameFormData, "difficult">
            name="difficult"
            control={control}
            render={({ field: { value, onChange } }) => (
              <StyledRating
                size="large"
                value={value || 0}
                IconContainerComponent={IconContainer}
                getLabelText={(val) => DIFFICULTY_CONFIG[val].label}
                onChange={(_, val) => onChange(val || 0)}
                onChangeActive={(_, h) => setHover(h)}
                highlightSelectedOnly
              />
            )}
          />
          {displayValue > 0 && (
            <span
              className={`text-xs font-black uppercase tracking-tighter ${DIFFICULTY_CONFIG[displayValue].color}`}
            >
              {DIFFICULTY_CONFIG[displayValue].label}
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          {displayValue > 0
            ? `Nível de desafio: ${displayValue}/5`
            : "Como foi o desafio?"}
        </p>
      </div>
    </FieldWrapper>
  );
};
