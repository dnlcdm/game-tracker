import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BACKLOG_QUERY_KEY,
  GAME_STATS_QUERY_KEY,
  PLAYING_QUERY_KEY,
} from "../constants";
import type { FinishGameFormData } from "../components/form-complete-game/types";
import { supabase } from "../../../services/supabase-client.service";

export const updateGameToCompleted = async (
  formData: FinishGameFormData,
  gameId: number,
): Promise<void> => {
  const payload = {
    status: "completed",
    user_rating: formData.user_rating * 2,
    difficult: formData.difficult,
    minutes_played:
      formData.hours_played.hours * 60 + formData.hours_played.minutes,
    co_op_friend: formData.co_op_friend,
    completed_at: new Date(formData.completed_at),
    completion_type: formData.completion_type,
    platform_used: formData.platform_used,
    review: formData.review,
  };

  const { error } = await supabase
    .from("games_backlog")
    .update(payload)
    .eq("id", gameId);

  if (error) {
    throw new Error(error.message || "Erro ao atualizar o status do jogo.");
  }
};

export const useUpdateToCompleteGame = (gameId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, FinishGameFormData>({
    mutationFn: (formData) => updateGameToCompleted(formData, gameId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKLOG_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PLAYING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GAME_STATS_QUERY_KEY });
    },

    onError: (error) => {
      console.error("Erro ao concluir o jogo:", error.message);
    },
  });
};
