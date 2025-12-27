import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IGameStatus } from "../../../types/games-stats.types";
import { BACKLOG_QUERY_KEY, PLAYING_QUERY_KEY } from "../constants";
import { updateGameFromPlaying } from "../utils/updateGameFromPlaying";

export const useUpdatePlayingGame = (status: IGameStatus) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (gameId) => updateGameFromPlaying(gameId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKLOG_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PLAYING_QUERY_KEY });
    },

    onError: (error) => {
      console.error("Erro ao atualizar o status do jogo:", error.message);
    },
  });
};
