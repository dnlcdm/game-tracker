import { useQuery } from "@tanstack/react-query";
import { getBacklogGames } from "../utils/getBacklogGames";
import type { IGamesSupabase } from "../../search-games/types/games.types";

export function useFetchBacklogGames() {
  return useQuery<IGamesSupabase[], Error>({
    queryKey: ["backlog"],
    queryFn: getBacklogGames,
  });
}
