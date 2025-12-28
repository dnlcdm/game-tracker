import { Controller, useFormContext, useWatch } from "react-hook-form";
import StarIcon from "@mui/icons-material/Star";
import Slider from "@mui/material/Slider"; // Importe o Slider do MUI
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

  return (
    <FieldWrapper label="Sua Avaliação" error={errors.user_rating?.message}>
      <div className="flex flex-col gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="hidden md:flex items-center justify-between">
          <Controller
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
          <span className="text-2xl font-black text-yellow-500 w-10 text-right">
            {currentRating > 0 ? currentRating * 2 : "-"}
          </span>
        </div>

        <div className="flex md:hidden flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-4xl font-black text-yellow-500">
              {currentRating > 0 ? (currentRating * 2).toFixed(0) : "?"}
            </span>
            <div className="text-right">
              <p className="uppercase text-lg font-black text-yellow-500">
                {RATING_LABELS[currentRating] || "Deslize para avaliar"}
              </p>
            </div>
          </div>

          <Controller
            name="user_rating"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Slider
                value={value || 0}
                min={0}
                max={5}
                step={0.5}
                onChange={(_, val) => {
                  onChange(val);
                }}
                sx={{
                  color: "#eab308",
                  height: 8,
                  "& .MuiSlider-thumb": {
                    width: 28,
                    height: 28,
                    backgroundColor: "#eab308",
                    border: "4px solid #1a1a1a",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(234, 179, 8, 0.16)",
                    },
                  },
                  "& .MuiSlider-rail": {
                    opacity: 0.2,
                    backgroundColor: "#ffffff",
                  },
                }}
              />
            )}
          />
        </div>

        <p className="hidden md:block text-[10px] text-gray-500 uppercase font-bold">
          {displayValue > 0
            ? RATING_LABELS[displayValue]
            : "Selecione uma nota"}
        </p>
      </div>
    </FieldWrapper>
  );
};
