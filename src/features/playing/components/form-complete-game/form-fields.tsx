import { type FormEventHandler } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FinishGameFormData } from "./types";
import { RatingInput } from "./fields/rating-input";
import { DifficultyInput } from "./fields/difficult-input";
import { CustomSelect } from "./fields/custom-select";
import { FieldWrapper, TimeInputField } from "./fields/time-input-field";
import { PLATFORMS } from "../../constants";

interface FinishGameFormFieldsProps {
  isSaving: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const FinishGameFormFields = ({
  isSaving,
  onSubmit,
}: FinishGameFormFieldsProps) => {
  const { control } = useFormContext<FinishGameFormData>();

  return (
    <form className="p-5 sm:p-6 space-y-6 bg-[#0B0F1A]" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex gap-2 w-full">
          <TimeInputField />
        </div>

        <Controller
          name="completed_at"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldWrapper label="Data da Conclusão" error={error?.message}>
              <input
                {...field}
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </FieldWrapper>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CustomSelect
          name="platform_used"
          label="Plataforma"
          options={PLATFORMS}
        />
        <CustomSelect
          name="completion_type"
          options={[
            { value: "main_story", label: "Campanha Principal" },
            { value: "main_extras", label: "Campanha + Extras" },
            { value: "completionist", label: "100%" },
            { value: "platinum", label: "Platina" },
          ]}
          label="Objetivo"
        />
      </div>

      <div className="space-y-6">
        <RatingInput />
        <DifficultyInput />
      </div>

      <Controller
        name="co_op_friend"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldWrapper label="Companheiro de Co-op" error={error?.message}>
            <input
              {...field}
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </FieldWrapper>
        )}
      />

      <Controller
        name="review"
        render={({ field }) => (
          <FieldWrapper label="Review">
            <textarea
              {...field}
              rows={3}
              placeholder="O que achou da jornada?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all"
            />
          </FieldWrapper>
        )}
      />

      <div className="pt-2 pb-4 sm:pb-0">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-black py-4 rounded-xl transition-all active:scale-[0.96] shadow-lg shadow-blue-900/20 uppercase tracking-widest text-xs"
        >
          {isSaving ? "Enviando..." : "Registrar Conclusão"}
        </button>
      </div>
    </form>
  );
};
