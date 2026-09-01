import { useQuery } from "@tanstack/react-query";
import { GAME_LIST_ITEMS_QUERY_KEY } from "../../playing/constants";
import { fetchListItems } from "../services/lists.service";
import type { IGameListItem } from "../types/list.types";

export function useFetchListItems() {
  return useQuery<IGameListItem[], Error>({
    queryKey: [GAME_LIST_ITEMS_QUERY_KEY],
    queryFn: fetchListItems,
    staleTime: Infinity,
  });
}
