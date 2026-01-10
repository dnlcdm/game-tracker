import type { IGamesSupabase } from "../../../features/search-games/types/games.types";

interface GameDetailsPlatformsProps {
  platforms?: IGamesSupabase["platforms"];
}

export const GameDetailsPlatforms = ({
  platforms,
}: GameDetailsPlatformsProps) => {
  if (!platforms?.length) return null;

  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
        Plataformas
      </h3>
      <div className="flex flex-wrap gap-2">
        {platforms.map((plat) => (
          <span
            key={plat.id}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-gray-400 uppercase tracking-tight hover:text-white transition-colors"
          >
            {plat.name}
          </span>
        ))}
      </div>
    </div>
  );
};
