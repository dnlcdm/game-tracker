import { motion, AnimatePresence } from "framer-motion";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import type { IGameAction } from "../types";
import { GameDetailsModal } from "../details/game-details-modal";
import { GameGridCard } from "../card/game-grid-card";
import { GameGridSkeleton } from "./game-grid-skeleton";
import { useSelectedGame } from "../hooks/useSelectedGame";

interface GameGridProps {
  items: IGamesSupabase[];
  actions?: IGameAction[];
  isLoading?: boolean;
}

const GRID_LAYOUT_CLASSES =
  "p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 mt-4";
const SKELETON_COUNT = 28;

export const GameGrid = ({ items, actions, isLoading }: GameGridProps) => {
  const { selectedGame, setSelectedGame } = useSelectedGame(items);
  const primaryAction = actions?.[0];

  if (isLoading) {
    return (
      <GameGridSkeleton
        className={GRID_LAYOUT_CLASSES}
        count={SKELETON_COUNT}
      />
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
