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

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="w-full md:w-2/5 relative shrink-0 aspect-[16/9] md:aspect-auto h-[250px] sm:h-[350px] md:h-auto">
          <img
            src={game.coverUrl}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-900" />
        </div>

        <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight italic uppercase">
              {game.name}
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5">
                <CalendarMonthIcon fontSize="small" className="text-blue-400" />
                {game.first_release_date ?? "N/A"}
              </span>

              {game.rating && (
                <div className="flex items-center gap-2">
                  <Rating
                    precision={0.2}
                    value={game.rating / 20}
                    readOnly
                    size="small"
                  />
                  <span className="font-bold text-white">
                    {Math.round(game.rating)}/100
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
            {actions?.map((action, index) => {
              const isCurrentlyLoading = action.isLoadingAction?.(game);

              return (
                <button
                  key={index}
                  disabled={isCurrentlyLoading}
                  onClick={() => action.onClick(game)}
                  className={`flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all border border-transparent
                    ${isCurrentlyLoading ? "bg-gray-800 opacity-50 cursor-not-allowed" : `bg-white/10 hover:bg-white/20 text-white active:scale-95 ${action.colorClass || "hover:text-blue-400"}`}
                  `}
                >
                  {isCurrentlyLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <span className="scale-110">{action.icon}</span>
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {game.platforms?.map((plat) => (
                <span
                  key={plat.id}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-semibold text-gray-300 uppercase"
                >
                  {plat.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-gray-500 text-xs leading-relaxed italic">
              Este jogo faz parte da sua biblioteca IGDB. Confira os detalhes e
              status no seu backlog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
