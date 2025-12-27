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
    <form className="p-6 space-y-6 bg-[#0B0F1A]" onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 gap-2">
          <TimeInputField />
        </div>
        <Controller
          name="completed_at"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldWrapper label="Data da Zerada" error={error?.message}>
              <input
                {...field}
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
              />
            </FieldWrapper>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          name="platform_used"
          label="Plataforma"
          options={PLATFORMS}
        />
        <CustomSelect
          name="completion_type"
          label="Objetivo"
          options={[
            { value: "main_story", label: "Campanha Principal" },
            { value: "main_extras", label: "Campanha + Extras" },
            { value: "completionist", label: "100%" },
            { value: "platina", label: "Platina" },
          ]}
        />
      </div>

      <RatingInput />

      <DifficultyInput />

      <Controller
        name="co_op_friend"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldWrapper label="Companheiro de Co-op" error={error?.message}>
            <input
              {...field}
              type="text"
              placeholder="Quem zerou com você?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
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

      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-black py-4 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 uppercase tracking-widest text-xs"
      >
        {isSaving ? "Processando..." : "Registrar Conclusão"}
      </button>
    </form>
  );
};
