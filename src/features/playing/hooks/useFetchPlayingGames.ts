import { useQuery } from "@tanstack/react-query";
import { getPlayingGames } from "../utils/getPlayingGames";
import type { IGames } from "../../search-games/types/games.types";

export function useFetchPlayingGames() {
  return useQuery<IGames[], Error>({
    queryKey: ["backlog_playing"],
    queryFn: getPlayingGames,
  });
}
