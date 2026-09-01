import { useQuery } from "@tanstack/react-query";
import { GAME_LISTS_QUERY_KEY } from "../../playing/constants";
import { fetchUserLists } from "../services/lists.service";
import type { IGameList } from "../types/list.types";

export function useFetchLists() {
  return useQuery<IGameList[], Error>({
    queryKey: [GAME_LISTS_QUERY_KEY],
    queryFn: fetchUserLists,
    staleTime: Infinity,
  });
}
