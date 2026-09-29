import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import { extractPsnId } from "./pricing/psn.utils";
import { usePriceAlert } from "../../../features/backlog/hooks/usePriceAlert";
import CircularProgress from "@mui/material/CircularProgress";

interface GameDetailsHeaderProps {
  game: IGamesSupabase;
}

export const GameDetailsHeader = ({ game }: GameDetailsHeaderProps) => {
  const release = game.first_release_date ?? "N/A";
  const rating10 =
    typeof game.rating === "number"
      ? (Math.round(game.rating) / 10).toFixed(1)
      : null;

  const isBacklogScreen = typeof window !== 'undefined' && window.location.pathname.includes('/backlog');
  const psnTarget = extractPsnId(game);
  const finalPsnId = psnTarget?.id || null;

  const { isActive, isPending, toggleAlert } = usePriceAlert(
    game.id,
    isBacklogScreen ? finalPsnId : null
  );

  return (
    <div className="relative">
      <div
        className="
          inline-flex items-center gap-2
          rounded-md px-2.5 py-1.5
          bg-black/70 backdrop-blur-md
          border border-white/15
          shadow-[0_10px_30px_rgba(0,0,0,0.55)]
        "
      >
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/10" />

        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
          <CalendarMonthIcon sx={{ fontSize: 14 }} className="text-blue-400" />
          <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {release}
          </span>
        </span>

        {rating10 && (
          <>
            <span className="h-3 w-px bg-white/15" />
            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white">
              <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                {rating10}
              </span>
            </span>
          </>
        )}

        {isBacklogScreen && finalPsnId && (
          <>
            <span className="h-3 w-px bg-white/15" />
            <button
              title="Receber notificações caso o preço desse jogo caia"
              onClick={(e) => {
                e.stopPropagation();
                toggleAlert();
              }}
              disabled={isPending}
              className="flex items-center justify-center text-white hover:text-blue-400 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <CircularProgress size={14} className="text-white" />
              ) : isActive ? (
                <NotificationsActiveIcon sx={{ fontSize: 16 }} className="text-blue-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
              ) : (
                <NotificationsNoneIcon sx={{ fontSize: 16 }} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
