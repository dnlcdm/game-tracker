import { supabase } from "../../../services/supabase-client.service";
import type { IGameStatus } from "../../../types/games-stats.types";
import type { IGamesSupabase } from "../../search-games/types/games.types";

export const getBacklogGames = async (): Promise<IGamesSupabase[]> => {
  const { data, error } = await supabase
    .from("games_backlog")
    .select("*")
    .eq("status", "backlog" as IGameStatus);

  if (error) {
    throw new Error(error.message || "Falha ao obter os jogos.");
  }

  return data;
};

export const deleteGameFromBacklog = async (gameId: number): Promise<void> => {
  const { error } = await supabase
    .from("games_backlog")
    .delete()
    .eq("id", gameId);

  if (error) {
    throw new Error(
      error.message || `Falha ao deletar o jogo de ID: ${gameId}`,
    );
  }
};
