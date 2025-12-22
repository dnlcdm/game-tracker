import { useEffect, useState, type ReactNode } from "react";
import type { IGames } from "../../features/search-games/types/games.types";
import { GameDetailsModal } from "./game-details-modal";

export interface IGameAction {
  icon: ReactNode;
  label: string;
  onClick: (game: IGames) => void;
  colorClass?: string;
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-9 gap-2 mt-4">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] bg-gray-700 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-9 gap-2 mt-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelectedGame(item)}
          className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-lg group bg-gray-900"
        >
          <img
            src={item.coverUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
          />
          <img
            src={item.coverUrl}
            alt={item.name}
            loading="lazy"
            className={`${!item.coverUrl && "p-2 mt-4"} absolute text-xs sm:text-sm font-bold line-clamp-3 flex items-center justify-center text-white text-center inset-0 m-auto w-auto h-auto max-h-full object-contain z-0`}
          />

          <div className="absolute inset-0 z-10 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 p-2">
            <div className="absolute top-2 right-2 flex gap-2 z-20">
              {actions?.map((action, index) => {
                const isCurrentlyLoading = action.isLoadingAction?.(item);

                return (
                  <button
                    key={index}
                    disabled={isCurrentlyLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      action.onClick(item);
                    }}
                    title={action.label}
                    className={`flex items-center justify-center p-1.5 rounded-full text-white transition-all bg-black/40 
                      ${isCurrentlyLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:scale-125 hover:bg-black/60"} 
                      ${action.colorClass || "hover:text-blue-400"}`}
                  >
                    {isCurrentlyLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      action.icon
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-xs sm:text-sm text-center font-bold text-white mt-4 line-clamp-3">
              {item.name}
            </span>
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
