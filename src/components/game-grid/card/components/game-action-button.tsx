import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";
import type { IGameAction } from "../../types";

interface GameActionButtonProps {
  action: IGameAction;
  game: IGamesSupabase;
}

export const GameActionButton = ({ action, game }: GameActionButtonProps) => {
  const isCurrentlyLoading = action.isLoadingAction?.(game);
  const renderedIcon = action.icon(game);
  const dynamicColorClass = action.colorClass
    ? action.colorClass(game)
    : "md:hover:text-blue-400";

  return (
    <button
      disabled={isCurrentlyLoading}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        action.onClick(game);
      }}
      className={`flex cursor-pointer items-center justify-center rounded-md text-white transition-all bg-black/60 backdrop-blur-md border border-white/10
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
};
