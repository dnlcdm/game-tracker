import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";

interface GameDetailsHeaderProps {
  game: IGamesSupabase;
}

export const GameDetailsHeader = ({ game }: GameDetailsHeaderProps) => {
  const release = game.first_release_date ?? "N/A";
  const rating10 =
    typeof game.rating === "number"
      ? (Math.round(game.rating) / 10).toFixed(1)
      : null;

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
      </div>
    </div>
  );
};
