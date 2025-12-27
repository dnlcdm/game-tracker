import { supabase } from "../../../services/supabase-client.service";
import type { IGameStatus } from "../../../types/games-stats.types";
import type { IGames } from "../../search-games/types/games.types";

export const getBacklogGames = async (): Promise<IGames[]> => {
  const { data, error } = await supabase
    .from("games_backlog")
    .select("*")
    .eq("status", "backlog" as IGameStatus);

  if (error) {
    throw new Error(error.message || "Falha ao obter os jogos.");
  }

  return data as IGames[];
};
