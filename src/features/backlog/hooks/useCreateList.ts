import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GAME_LISTS_QUERY_KEY } from "../../playing/constants";
import { createList } from "../utils/listUtils";
import type { IGameList } from "../types/list.types";

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation<IGameList, Error, string>({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GAME_LISTS_QUERY_KEY] });
    },
  });
}
