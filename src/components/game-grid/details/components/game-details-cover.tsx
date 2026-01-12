import type { FC } from "react";
import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";
import { GameDetailsHeader } from "./game-details-header";

type Props = {
  game: IGamesSupabase;
};
export const GameDetailsCover: FC<Props> = ({ game }) => {
  const src = game.coverUrl?.includes("t_cover_big")
    ? game.coverUrl.replace("t_cover_big", "t_720p")
    : game.coverUrl;

  return (
    <div className="w-full md:w-5/12 relative shrink-0 h-[35vh] md:h-auto overflow-hidden">
      <img
        src={src}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover scale-[1.03] blur-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/25 to-transparent md:bg-gradient-to-r md:from-transparent md:via-gray-950/10 md:to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.12),transparent_55%)]" />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="inline-flex max-w-full flex-col gap-2">
          <div className="h-[2px] w-16 rounded-full bg-white/20">
            <div className="h-[2px] w-8 rounded-full bg-blue-400/80" />
          </div>

          <h2
            className="
              text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white
              drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]
              line-clamp-2
            "
          >
            {game.name}
          </h2>

          <div className="pointer-events-none absolute -bottom-10 left-4 md:left-6 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
        </div>
        <div className="absolute rounded-md top-0">
          <GameDetailsHeader game={game} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
};
