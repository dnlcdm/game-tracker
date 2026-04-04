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
  const visible = (actions ?? [])
    .map((action) => {
      const label = action.label(game);
      return label ? { action, label } : null;
    })
    .filter(Boolean) as Array<{ action: IGameAction; label: string }>;

  if (!visible.length) return null;

  const isSingle = visible.length === 1;
  const defaultClass =
    "bg-white/[0.04] hover:bg-white/[0.07] text-white/90 border-white/10";
  const loadingClass = "cursor-wait opacity-60 bg-white/[0.03] border-white/10";

  return (
    <div className="space-y-2 pt-1">
      <div className="grid grid-cols-1 justify-end-safe gap-2 lg:grid-cols-2">
        {visible.map(({ action, label }, index) => {
          const isLoading = action.isLoadingAction?.(game) ?? false;
          const colorClass = action.colorClass?.(game) ?? defaultClass;

          return (
            <button
              key={index}
              type="button"
              disabled={isLoading}
              onClick={() => {
                action.onClick(game);
                onClose();
              }}
              className={[
                "relative w-full overflow-hidden rounded-xl border px-4 py-3 md:py-2.5",
                "flex items-center justify-center",
                "text-[11px] font-black uppercase tracking-widest",
                "transition active:scale-[0.98] backdrop-blur-md",
                "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                isLoading ? loadingClass : colorClass,
                isSingle ? "sm:col-span-2" : "",
              ].join(" ")}
            >
              {isLoading && (
                <span className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.04]" />
              )}

              <span className="relative z-10 line-clamp-1">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
