import { useMemo } from "react";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import type { IGameListItem } from "../types/list.types";

interface UseBacklogListFilterParams {
  games: IGamesSupabase[] | undefined;
  listItems: IGameListItem[];
  selectedListId: string | null;
}

export const useBacklogListFilter = ({
  games,
  listItems,
  selectedListId,
}: UseBacklogListFilterParams) => {
  const gameCountByList = useMemo(() => {
    const counts: Record<string, number> = {};
    const validGameIds = new Set(games?.map((g) => g.id) ?? []);

    for (const item of listItems) {
      if (validGameIds.has(item.game_id)) {
        counts[item.list_id] = (counts[item.list_id] ?? 0) + 1;
      }
    }
    return counts;
  }, [listItems, games]);

  const uncategorizedCount = useMemo(() => {
    if (!games) return 0;
    const assignedIds = new Set(listItems.map((item) => item.game_id));
    return games.filter((game) => !assignedIds.has(game.id)).length;
  }, [games, listItems]);

  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (!selectedListId) return games;

    if (selectedListId === "uncategorized") {
      const assignedIds = new Set(listItems.map((item) => item.game_id));
      return games.filter((game) => !assignedIds.has(game.id));
    }

    const gameIdsInList = new Set(
      listItems
        .filter((item) => item.list_id === selectedListId)
        .map((item) => item.game_id),
    );

    return games.filter((game) => gameIdsInList.has(game.id));
  }, [games, selectedListId, listItems]);

  return { gameCountByList, uncategorizedCount, filteredGames };
};
