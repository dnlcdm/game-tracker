import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GAME_LISTS_QUERY_KEY } from "../../playing/constants";
import { renameList } from "../services/lists.service";

export function useRenameList() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { listId: string; name: string }>({
    mutationFn: ({ listId, name }) => renameList(listId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GAME_LISTS_QUERY_KEY] });
    },
  });
}
