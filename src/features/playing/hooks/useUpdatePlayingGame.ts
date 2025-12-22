import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGameFromPlaying } from "../utils/updateGameFromPlaying";

export const useUpdatePlayingGame = (playing: boolean) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (e) => updateGameFromPlaying(e, playing),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backlog"] });
      queryClient.invalidateQueries({ queryKey: ["backlog_playing"] });
    },

    onError: (error) => {
      console.error("Erro na mutação de deleção:", error.message);
    },
  });
};
