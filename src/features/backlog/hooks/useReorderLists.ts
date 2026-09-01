import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GAME_LISTS_QUERY_KEY } from "../../playing/constants";
import { reorderLists } from "../services/lists.service";
import type { IGameList } from "../types/list.types";

export function useReorderLists() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[], { previous: IGameList[] | undefined }>({
    mutationFn: reorderLists,
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: [GAME_LISTS_QUERY_KEY] });
      const previous = queryClient.getQueryData<IGameList[]>([
        GAME_LISTS_QUERY_KEY,
      ]);

      if (previous) {
        const reordered = orderedIds
          .map((id, index) => {
            const list = previous.find((l) => l.id === id);
            return list ? { ...list, sort_order: index } : null;
          })
          .filter(Boolean) as IGameList[];

        queryClient.setQueryData([GAME_LISTS_QUERY_KEY], reordered);
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([GAME_LISTS_QUERY_KEY], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [GAME_LISTS_QUERY_KEY] });
    },
  });
}
