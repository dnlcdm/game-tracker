import { useQuery } from "@tanstack/react-query";
import { getBacklogGames } from "../services/backlog-games.service";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import { BACKLOG_QUERY_KEY } from "../../playing/constants";

export function useFetchBacklogGames() {
  return useQuery<IGamesSupabase[], Error>({
    queryKey: [BACKLOG_QUERY_KEY],
    queryFn: getBacklogGames,
    staleTime: Infinity,
  });
}
