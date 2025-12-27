import { useQuery } from "@tanstack/react-query";
import type { IGames } from "../../search-games/types/games.types";
import { supabase } from "../../../services/supabase-client.service";
import type { IGameStatus } from "../../../types/games-stats.types";

export const getBacklogGames = async (): Promise<IGames[]> => {
  const { data, error } = await supabase
    .from("games_backlog")
    .select("*")
    .order("completed_at", { ascending: false })
    .eq("status", "completed" as IGameStatus);

  if (error) {
    throw new Error(error.message || "Falha ao obter os jogos.");
  }

  return data as IGames[];
};

export function useFetchGameStats() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<any[], Error>({
    queryKey: ["completed"],
    queryFn: getBacklogGames,
  });
}
