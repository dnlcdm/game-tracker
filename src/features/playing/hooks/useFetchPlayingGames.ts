import { useQuery } from "@tanstack/react-query";
import type { IGames } from "../../search-games/types/games.types";
import { getPlayingGames } from "../utils/getPlayingGames";

export function useFetchPlayingGames() {
  return useQuery<IGames[], Error>({
    queryKey: ["backlog_playing"],
    queryFn: getPlayingGames,
    refetchOnWindowFocus: true,
  });
}
