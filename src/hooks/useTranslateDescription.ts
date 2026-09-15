import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/api-client";
import { PATHS } from "../constants/endpoint-paths.contants";

interface TranslatePayload {
  gameId: number;
  text: string;
}

const translateText = async (payload: TranslatePayload) => {
  if (!payload.text || !payload.gameId) return null;
  const { data } = await apiClient.post<{ translatedText: string }>(PATHS.AI_GAME_INSIGHTS, payload);

  return data?.translatedText || null;
};

export const useTranslateDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TranslatePayload) => translateText(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["game_translation", variables.gameId],
      });
    },
  });
};
