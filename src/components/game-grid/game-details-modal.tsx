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
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-950 border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <div
          onClick={onClose}
          className="absolute top-5 right-5 z-50 p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/5 backdrop-blur-md cursor-pointer"
        >
          <CloseIcon fontSize="small" className="m-0" />
        </div>

        <div className="w-full md:w-5/12 relative shrink-0 h-[300px] md:h-auto">
          <img
            src={game.coverUrl}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-950" />
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] italic uppercase tracking-tighter">
              {game.name}
            </h2>

            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/5">
                <CalendarMonthIcon
                  sx={{ fontSize: 16 }}
                  className="text-blue-400"
                />
                {game.first_release_date ?? "N/A"}
              </span>

              {game.rating && (
                <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-md border border-white/5">
                  <Rating
                    precision={0.5}
                    value={game.rating / 20}
                    readOnly
                    size="small"
                    sx={{ color: "#60a5fa" }}
                  />
                  <span className="text-white">
                    {Math.round(game.rating) / 10}/10
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {actions?.map((action, index) => {
              const isCurrentlyLoading = action.isLoadingAction?.(game);
              const dynamicColorClass = action.colorClass
                ? action.colorClass(game)
                : "text-white bg-white/5 hover:bg-white/10";

              return (
                <button
                  key={index}
                  disabled={isCurrentlyLoading}
                  onClick={() => {
                    action.onClick(game);
                    onClose();
                  }}
                  className={`
                    flex items-center gap-3 px-6 py-3.5 rounded-md text-xs font-black uppercase tracking-widest transition-all border border-white/5
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

          {game?.platforms?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80">
                Disponível em
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((plat) => (
                  <span
                    key={plat.id}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-gray-300 uppercase tracking-tight"
                  >
                    {plat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-white/5">
            <p className="text-gray-600 text-[10px] leading-relaxed uppercase font-medium tracking-wider">
              Dados fornecidos via IGDB API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
