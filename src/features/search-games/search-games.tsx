import type { FC } from "react";
import { GamesFilters } from "./components/games-filters";
import { GamesList } from "./components/games-list";
import { DataGameProvider } from "./providers/data-game-provider";

export const SearchGames: FC = () => {
  return (
    <DataGameProvider>
      <GamesFilters />
      <GamesList />
    </DataGameProvider>
  );
};
