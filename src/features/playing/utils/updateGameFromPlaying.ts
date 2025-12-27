import { supabase } from "../../../services/supabase-client.service";
import type { IGameStatus } from "../../../types/games-stats.types";

export const updateGameFromPlaying = async (
  gameId: number,
  status: IGameStatus,
): Promise<void> => {
  const { error } = await supabase
    .from("games_backlog")
    .update({ status })
    .eq("id", gameId);

  if (error) {
    throw new Error(error.message || "Erro ao atualizar o status do jogo.");
  }
};
