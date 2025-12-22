import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGameFromBacklog } from "../utils/deleteGameFromBacklog";

export const useDeleteBacklogGame = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteGameFromBacklog,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backlog"] });
    },

    onError: (error) => {
      console.error("Erro na mutação de deleção:", error.message);
    },
  });
};
