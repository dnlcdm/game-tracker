import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";
import type { IGameAction } from "../../types";

interface GameDetailsActionsProps {
  actions: IGameAction[];
  game: IGamesSupabase;
  onClose: () => void;
}

export const GameDetailsActions = ({
  actions,
  game,
  onClose,
}: GameDetailsActionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-3 pt-2">
      {actions?.map((action, index) => {
        const isCurrentlyLoading = action.isLoadingAction?.(game);
        const dynamicColorClass = action.colorClass
          ? action.colorClass(game)
          : "text-white bg-white/5 hover:bg-white/10";

        if (!action.label(game)) return null;

        return (
          <button
            key={index}
            disabled={isCurrentlyLoading}
            onClick={() => {
              action.onClick(game);
              onClose();
            }}
            className={`
                    flex items-center justify-center gap-3 px-6 py-4 md:py-3.5 rounded-xl md:rounded-md text-xs font-black uppercase tracking-widest transition-all border border-white/5
                    ${
                      isCurrentlyLoading
                        ? "bg-white/5 opacity-50 cursor-wait"
                        : `backdrop-blur-xl active:scale-95 shadow-lg ${dynamicColorClass}`
                    }
                  `}
          >
            {action.label(game)}
          </button>
        );
      })}
    </div>
  );
};
