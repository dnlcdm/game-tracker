import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameDetailsModal } from "./game-details-modal";
import type { IGamesSupabase } from "../../features/search-games/types/games.types";
import type { IGameAction } from "./types";
import { GameGridCard } from "./game-grid-card";

interface GameGridProps {
  items: IGamesSupabase[];
  actions?: IGameAction[];
  isLoading?: boolean;
}

const GRID_LAYOUT_CLASSES =
  "p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 mt-4";
const SKELETON_COUNT = 28;

const useSelectedGame = (items: IGamesSupabase[]) => {
  const [selectedGame, setSelectedGame] = useState<IGamesSupabase | null>(null);

  useEffect(() => {
    if (!selectedGame) return;
    const gameExists = items.some((item) => item.id === selectedGame.id);
    if (!gameExists) setSelectedGame(null);
  }, [items, selectedGame]);

  return { selectedGame, setSelectedGame };
};

export const GameGrid = ({ items, actions, isLoading }: GameGridProps) => {
  const { selectedGame, setSelectedGame } = useSelectedGame(items);
  const primaryAction = actions?.[0];

  if (isLoading) {
    return (
      <div className={GRID_LAYOUT_CLASSES}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] bg-gray-800/50 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={GRID_LAYOUT_CLASSES}>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
          >
            <GameGridCard
              game={item}
              status={primaryAction ? primaryAction.gameStatus(item) : ""}
              actions={actions}
              onSelect={setSelectedGame}
            />
          </motion.div>
        ))}
      </AnimatePresence>

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
