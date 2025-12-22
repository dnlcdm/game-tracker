import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "../../auth/hooks/useUserAuth";
import { addToBacklog } from "../components/utils/addToBacklog";
import type { IGames } from "../types/games.types";

export const useAddGameToBacklog = () => {
  const queryClient = useQueryClient();
  const { session } = useUserAuth();

  return useMutation({
    mutationFn: (gameData: IGames) => addToBacklog(gameData, session),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backlog"] });
    },

    onError: (error) => {
      console.error("Falha ao adicionar ao backlog:", error.message);
    },
  });
};
