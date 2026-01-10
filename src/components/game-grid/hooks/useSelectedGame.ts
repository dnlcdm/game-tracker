import { useEffect, useState } from "react";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";

export const useSelectedGame = (items: IGamesSupabase[]) => {
  const [selectedGame, setSelectedGame] = useState<IGamesSupabase | null>(null);

  useEffect(() => {
    if (!selectedGame) return;
    const gameExists = items.some((item) => item.id === selectedGame.id);
    if (!gameExists) setSelectedGame(null);
  }, [items, selectedGame]);

  return { selectedGame, setSelectedGame };
};
