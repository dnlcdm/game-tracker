import type { IGames } from "../../features/search-games/types/games.types";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { IGameAction } from "./game-grid";
import Rating from "@mui/material/Rating";

interface Props {
  game: IGames;
  onClose: () => void;
  actions: IGameAction[];
}

export const GameDetailsModal = ({ game, actions, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-gray-900/90 border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 cursor-pointer"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="w-full md:w-2/5 relative aspect-[3/4] md:aspect-auto h-[300px] md:h-auto">
          <img
            src={game.coverUrl}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-900" />
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2 italic uppercase">
              {game.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <CalendarMonthIcon fontSize="small" className="text-blue-400" />
                {game.first_release_date ?? "N/A"}
              </span>
              {game.rating && (
                <span className="flex items-center gap-1">
                  <Rating
                    precision={0.2}
                    defaultValue={game.rating / 20}
                    readOnly
                  />
                  {game.rating ? `${Math.round(game.rating)}/100` : "N/A"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {actions?.map((action, index) => {
              const isCurrentlyLoading = action.isLoadingAction?.(game);

              return (
                <button
                  key={index}
                  disabled={isCurrentlyLoading}
                  onClick={() => action.onClick(game)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-transparent
                    ${isCurrentlyLoading ? "bg-gray-800 opacity-50 cursor-not-allowed" : `bg-white/10 hover:bg-white/20 text-white ${action.colorClass || "hover:text-blue-400"}`}
                  `}
                >
                  {isCurrentlyLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    action.icon
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {game.platforms?.map((plat) => (
                <span
                  key={plat.id}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-gray-300"
                >
                  {plat.name}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-gray-400 text-sm leading-relaxed">
              Este jogo faz parte da sua biblioteca IGDB. Confira os detalhes e
              status no seu backlog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
