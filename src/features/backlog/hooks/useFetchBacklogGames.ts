import { useQuery } from "@tanstack/react-query";
import { getBacklogGames } from "../utils/getBacklogGames";
import type { IGames } from "../../search-games/types/games.types";

export function useFetchBacklogGames() {
  return useQuery<IGames[], Error>({
    queryKey: ["backlog"],
    queryFn: getBacklogGames,
    refetchOnWindowFocus: true,
  });
}
