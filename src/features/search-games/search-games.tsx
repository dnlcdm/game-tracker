import type { FC } from "react";
import { GamesFilters } from "./components/games-filters";
import { GamesList } from "./components/games-list";
import { DataGameProvider } from "./providers/data-game-provider";
import { SidebarFilters } from "./components/sidebar-filters";

export const SearchGames: FC = () => {
  return (
    <DataGameProvider>
      <div className="w-full pb-8 md:px-6">

        <div className="flex flex-col lg:flex-row gap-x-6">
          <div className="order-2 lg:order-1 flex-1 min-w-0 flex flex-col gap-6 md:pr-6">
            <GamesFilters />
            <GamesList />
          </div>
          <div className="order-1 lg:order-2">
            <SidebarFilters />
          </div>
        </div>
      </div>
    </DataGameProvider>
  );
};
