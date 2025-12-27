import { Controller, useFormContext, useWatch } from "react-hook-form";
import StarIcon from "@mui/icons-material/Star";
import type { FinishGameFormData } from "../types";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import { FieldWrapper } from "./time-input-field";

const RATING_LABELS: { [index: string]: string } = {
  0.5: "Tragédia",
  1: "Terrível",
  1.5: "Ruim",
  2: "Tanto faz",
  2.5: "Decente",
  3: "Bom",
  3.5: "Muito bom",
  4: "Ótimo",
  4.5: "Incrível",
  5: "Jogo da vida",
};

export const RatingInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FinishGameFormData>();

  const [hover, setHover] = useState<number>(-1);

  const currentRating =
    useWatch<FinishGameFormData, "user_rating">({
      control,
      name: "user_rating",
    }) || 0;

  const displayValue = hover !== -1 ? hover : currentRating;

  const ratingError = errors.user_rating?.message;

  return (
    <>
      <FieldWrapper label="Sua Avaliação" error={ratingError}>
        <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <Controller<FinishGameFormData, "user_rating">
              name="user_rating"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Rating
                  size="large"
                  precision={0.5}
                  value={value || 0}
                  onChange={(_, val) => onChange(val || 0)}
                  onChangeActive={(_, h) => setHover(h)}
                  emptyIcon={
                    <StarIcon
                      style={{ opacity: 0.2, color: "white" }}
                      fontSize="inherit"
                    />
                  }
                />
              )}
            />
            <span className="text-sm font-black text-yellow-500">
              {Number(displayValue.toFixed(1)) * 2}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
            {displayValue > 0
              ? RATING_LABELS[displayValue]
              : "Selecione uma nota"}
          </p>
        </div>
      </FieldWrapper>
    </>
  );
};
