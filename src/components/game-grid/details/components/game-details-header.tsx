import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Rating from "@mui/material/Rating";
import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";

interface GameDetailsHeaderProps {
  game: IGamesSupabase;
}

export const GameDetailsHeader = ({ game }: GameDetailsHeaderProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.1] italic uppercase tracking-tighter">
        {game.name}
      </h2>

      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        <span className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
          <CalendarMonthIcon sx={{ fontSize: 16 }} className="text-blue-400" />
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
  );
};
