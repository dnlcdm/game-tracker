import { useEffect, useState, type ReactNode } from "react";
import { GameDetailsModal } from "./game-details-modal";
import type { IGames } from "../../features/search-games/types/games.types";

export interface IGameAction {
  icon: (game: IGames) => ReactNode;
  label: (game: IGames) => string;
  onClick: (game: IGames) => void | null;
  colorClass?: (game: IGames) => string; // Agora é uma função que recebe o jogo
  isLoadingAction?: (game: IGames) => boolean;
}

interface GameGridProps {
  items: IGames[];
  actions?: IGameAction[];
  isLoading?: boolean;
}

export const GameGrid = ({ items, actions, isLoading }: GameGridProps) => {
  const [selectedGame, setSelectedGame] = useState<IGames | null>(null);

  useEffect(() => {
    if (selectedGame) {
      const gameExists = items.find((item) => item.id === selectedGame.id);
      if (!gameExists) setSelectedGame(null);
    }
  }, [items, selectedGame]);

  const gridLayoutClasses =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 mt-4";

  if (isLoading) {
    return (
      <div className={gridLayoutClasses}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] bg-gray-800/50 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={gridLayoutClasses}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelectedGame(item)}
          className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg group bg-gray-900 cursor-pointer active:scale-[0.98] transition-transform duration-150"
        >
          <img
            src={item.coverUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          />

          <img
            src={item.coverUrl}
            alt={item.name}
            loading="lazy"
            className={`absolute inset-0 m-auto w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105 ${
              !item.coverUrl && "p-4 object-contain opacity-50"
            }`}
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300">
            <div className="absolute top-1 right-1 flex gap-1.5 z-20">
              {actions?.map((action, index) => {
                const isCurrentlyLoading = action.isLoadingAction?.(item);
                const renderedIcon = action.icon(item);
                const dynamicColorClass = action.colorClass
                  ? action.colorClass(item)
                  : "md:hover:text-blue-400";

                return (
                  <button
                    key={index}
                    disabled={isCurrentlyLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      action.onClick(item);
                    }}
                    className={`flex items-center justify-center rounded-md text-white transition-all bg-black/60 backdrop-blur-md border border-white/10
                      ${isCurrentlyLoading ? "opacity-50" : "active:scale-125 "} 
                      ${dynamicColorClass}`}
                  >
                    {isCurrentlyLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      renderedIcon
                    )}
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-[11px] sm:text-xs text-left font-bold text-white line-clamp-2 leading-tight uppercase tracking-wide drop-shadow-md">
                {item.name}
              </span>
            </div>
          </div>
        </div>
      ))}

      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          actions={actions || []}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
};
