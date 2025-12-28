import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase-client.service";
import type { IGameStatus } from "../../../types/games-stats.types";
import type { IGamesSupabase } from "../../search-games/types/games.types";

export const getBacklogGames = async (): Promise<IGamesSupabase[]> => {
  const { data, error } = await supabase
    .from("games_backlog")
    .select("*")
    .order("completed_at", { ascending: false })
    .eq("status", "completed" as IGameStatus);

  if (error) {
    throw new Error(error.message || "Falha ao obter os jogos.");
  }

  return data;
};

export function useFetchGameStats() {
  return useQuery<IGamesSupabase[], Error>({
    queryKey: ["completed"],
    queryFn: getBacklogGames,
  });
}
