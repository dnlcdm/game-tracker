import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import type { IGameAction } from "../types";
import { GameDetailsModal } from "../details/game-details-modal";
import { GameGridCard } from "../card/game-grid-card";
import { GameGridSkeleton } from "./game-grid-skeleton";
import { useSearchParams } from "react-router";

interface GameGridProps {
  items: IGamesSupabase[];
  actions?: IGameAction[];
  isLoading?: boolean;
}

const GRID_LAYOUT_CLASSES = 
  "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 md:gap-3 mt-4";

const SKELETON_COUNT = 28;

const GAME_QP = "game";

const toGameId = (v: string | null) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const GameGrid = ({ items, actions, isLoading }: GameGridProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const primaryAction = actions?.[0];

  const selectedGameId = toGameId(searchParams.get(GAME_QP));

  const selectedGame = useMemo(() => {
    if (!selectedGameId) return null;
    return items.find((g) => Number(g.id) === selectedGameId) ?? null;
  }, [items, selectedGameId]);

  const openModal = (game: IGamesSupabase) => {
    const next = new URLSearchParams(searchParams);
    next.set(GAME_QP, String(game.id));
    setSearchParams(next, { replace: false });
  };

  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(GAME_QP);
    setSearchParams(next, { replace: false });
  };

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
              onSelect={openModal} 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          actions={actions || []}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
