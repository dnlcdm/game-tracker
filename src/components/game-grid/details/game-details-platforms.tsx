import { useEffect, useRef } from "react";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";

interface GameDetailsPlatformsProps {
  platforms?: IGamesSupabase["platforms"];
}

export const GameDetailsPlatforms = ({
  platforms,
}: GameDetailsPlatformsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let direction = 1;
    const speed = 0.2;

    const autoScroll = () => {
      if (!isPausedRef.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += speed * direction;

        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          direction = -1;
        } else if (el.scrollLeft <= 0) {
          direction = 1;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [platforms]);

  if (!platforms?.length) return null;

  return (
    <div className="space-y-3 pt-2">
      <div
        ref={scrollRef}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onTouchStart={() => { isPausedRef.current = true; }}
        onTouchEnd={() => { isPausedRef.current = false; }}
        className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {platforms.map((plat) => (
          <span
            key={plat.id}
            className="px-3 whitespace-nowrap py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-gray-400 uppercase tracking-tight hover:text-white transition-colors"
          >
            {plat.abbr || plat.name}
          </span>
        ))}
      </div>
    </div>
  );
};

