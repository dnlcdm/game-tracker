import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GAME_LIST_ITEMS_QUERY_KEY } from "../../playing/constants";
import { toggleGameInList } from "../services/lists.service";

export function useToggleGameInList() {
  const queryClient = useQueryClient();

  return useMutation<
    { added: boolean },
    Error,
    { listId: string; gameId: number }
  >({
    mutationFn: ({ listId, gameId }) => toggleGameInList(listId, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GAME_LIST_ITEMS_QUERY_KEY],
      });
    },
  });
}
