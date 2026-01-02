import { useState } from "react";
import type { IGamesSupabase } from "../../search-games/types/games.types";

export const useSelectedGameToFinish = () => {
  const [selectedGameToFinish, setSelectedGameToFinish] =
    useState<IGamesSupabase | null>(null);

  const openModal = (game: IGamesSupabase) => {
    setSelectedGameToFinish(game);
  };

  const closeModal = () => {
    setSelectedGameToFinish(null);
  };

  return { selectedGameToFinish, openModal, closeModal };
};
