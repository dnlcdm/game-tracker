import type { IGamesSupabase } from "../../features/search-games/types/games.types";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import type { IGameAction } from "./types";
import Rating from "@mui/material/Rating";
import { TimeRow } from "./time-row";

interface Props {
  game: IGamesSupabase;
  onClose: () => void;
  actions: IGameAction[];
}

export const GameDetailsModal = ({ game, actions, onClose }: Props) => {
  const timeData = game.timeToBeat?.[0];
  const hasTimeData =
    timeData && (timeData.normally || timeData.completely || timeData.hastily);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl hidden md:block"
        onClick={onClose}
      />

      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:max-h-[85vh] bg-gray-950 md:border md:border-white/10 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in md:zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-black/50 text-white/90 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
        >
          <CloseIcon fontSize="medium" />
        </button>

        <div className="w-full md:w-5/12 relative shrink-0 h-[35vh] md:h-auto">
          <img
            src={game.coverUrl.replace("t_cover_big", "t_720p")}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-950" />
        </div>

        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.1] italic uppercase tracking-tighter">
              {game.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                <CalendarMonthIcon
                  sx={{ fontSize: 16 }}
                  className="text-blue-400"
                />
                {game.first_release_date ?? "N/A"}
              </span>

              {game.rating && (
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                  <Rating
                    precision={0.5}
                    value={game.rating / 20}
                    readOnly
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#60a5fa" },
                      "& .MuiRating-iconEmpty": {
                        color: "rgba(255,255,255,0.1)",
                      },
                    }}
                  />
                  <span className="text-white">
                    {Math.round(game.rating) / 10}/10
                  </span>
                </div>
              )}
            </div>
          </div>

          {hasTimeData && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1 opacity-70">
                <AccessTimeIcon
                  sx={{ fontSize: 14 }}
                  className="text-gray-400"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Tempo Estimado
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <TimeRow
                  label="História Principal"
                  seconds={timeData.normally}
                  colorClass="bg-blue-500"
                  icon={SportsEsportsIcon}
                />

                <TimeRow
                  label="Rush"
                  seconds={timeData.hastily}
                  colorClass="bg-orange-500"
                  icon={TrendingUpIcon}
                />

                <TimeRow
                  label="100% Completo"
                  seconds={timeData.completely}
                  colorClass="bg-red-500"
                  icon={EmojiEventsIcon}
                />
              </div>
            </div>
          )}

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

          {game?.platforms?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                Plataformas
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((plat) => (
                  <span
                    key={plat.id}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-gray-400 uppercase tracking-tight hover:text-white transition-colors"
                  >
                    {plat.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

