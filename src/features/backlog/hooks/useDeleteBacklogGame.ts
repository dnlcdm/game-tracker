import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGameFromBacklog } from "../utils/deleteGameFromBacklog";
import { BACKLOG_QUERY_KEY, PLAYING_QUERY_KEY } from "../../playing/constants";

export const useDeleteBacklogGame = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteGameFromBacklog,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BACKLOG_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PLAYING_QUERY_KEY] });
    },

    onError: (error) => {
      console.error("Erro na mutação de deleção:", error.message);
    },
  });
};
