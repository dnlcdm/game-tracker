import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "../../auth/hooks/useUserAuth";
import { addToBacklog } from "../components/utils/addToBacklog";
import type { IGames } from "../types/games.types";
import { removeFromBacklog } from "./removeFromBacklog";
import { supabase } from "../../../services/supabase-client.service";
import { BACKLOG_QUERY_KEY } from "../../playing/constants";

export const useToggleBacklog = () => {
  const queryClient = useQueryClient();
  const { session } = useUserAuth();

  return useMutation({
    mutationFn: async (gameData: IGames) => {
      const userId = session?.user.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const { data: existingGame, error: fetchError } = await supabase
        .from("games_backlog")
        .select("id")
        .eq("user_id", userId)
        .eq("id", gameData.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingGame) {
        return await removeFromBacklog(gameData.id, userId);
      } else {
        return await addToBacklog(gameData, session);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BACKLOG_QUERY_KEY] });
    },

    onError: (error) => {
      console.error("Erro na operação do backlog:", error.message);
    },
  });
};
