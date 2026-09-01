import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GAME_LISTS_QUERY_KEY,
  GAME_LIST_ITEMS_QUERY_KEY,
} from "../../playing/constants";
import { deleteList } from "../services/lists.service";

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GAME_LISTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GAME_LIST_ITEMS_QUERY_KEY] });
    },
  });
}
