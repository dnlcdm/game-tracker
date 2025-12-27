import { z } from "zod";

export const finishGameSchema = z.object({
  user_rating: z.number().min(1, "De uma nota entre 1 e 5").max(5),
  difficult: z.number().min(1, "Selecione a dificuldade").max(6),
  hours_played: z.object({
    hours: z.coerce.number().int().min(0, "Horas inválidas"),
    minutes: z.coerce
      .number()
      .int()
      .min(0)
      .max(59, "Minutos devem ser entre 0 e 59"),
  }),
  completed_at: z.string().min(1, "A data de conclusao e obrigatoria"),
  platform_used: z.string().min(1, "A plataforma usada e obrigatoria"),
  completion_type: z.string().min(1, "Selecione uma opção"),
  co_op_friend: z.string().max(50, "Nome muito longo").optional(),
  review: z
    .string()
    .max(500, "A review deve ter no maximo 500 caracteres")
    .optional(),
});

export type FinishGameFormData = z.infer<typeof finishGameSchema>;
export type FinishGameFormValues = z.input<typeof finishGameSchema>;
