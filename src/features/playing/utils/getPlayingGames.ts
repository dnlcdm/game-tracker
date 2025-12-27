import { supabase } from "../../../services/supabase-client.service";
import type { IGames } from "../../search-games/types/games.types";

export const getPlayingGames = async (): Promise<IGames[]> => {
  const { data, error } = await supabase
    .from("games_backlog")
    .select("*")
    .eq("status", "playing");

  if (error) {
    throw new Error(error.message || "Falha ao obter os jogos.");
  }

  return (data ?? []) as IGames[];
};
