import { useQuery } from "@tanstack/react-query";
import type { IGames } from "../../search-games/types/games.types";
import { PLAYING_QUERY_KEY } from "../constants";
import { getPlayingGames } from "../utils/getPlayingGames";

export function useFetchPlayingGames() {
  return useQuery<IGames[], Error>({
    queryKey: PLAYING_QUERY_KEY,
    queryFn: getPlayingGames,
  });
}
