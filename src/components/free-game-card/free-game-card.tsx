import { useFreeGames } from "./hooks/UseFreeGames";
import { useRef, useEffect, useState } from "react";

export const FreeGameCard = () => {
  const { data: games = [], isLoading, isError } = useFreeGames();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const hasOverflow =
          contentRef.current.scrollWidth > containerRef.current.clientWidth;
        setShouldAnimate(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [games]);

  if (isLoading || isError || games.length === 0) return null;

  const tickerItems = shouldAnimate ? [...games, ...games, ...games] : games;

  return (
    <div className="w-full bg-slate-950/90 border-b border-white/5 sticky top-0 z-50 overflow-hidden">
      <div className="flex items-center max-w-[1920px] mx-auto">
        <div className="z-20 bg-slate-950 pr-3 pl-4 md:px-6 flex items-center gap-2 border-r border-white/10 shrink-0 shadow-[10px_0_20px_rgba(0,0,0,0.8)]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-tighter md:tracking-[0.2em]">
            Free <span className="hidden xs:inline">Deals</span>
          </span>
        </div>

        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden flex items-center"
        >
          <div
            ref={contentRef}
            className={`flex items-center py-2 md:py-3 ${
              shouldAnimate
                ? "animate-marquee hover:[animation-play-state:paused]"
                : "justify-start"
            }`}
            style={{
              width: shouldAnimate ? "max-content" : "auto",
            }}
          >
            {tickerItems.map((game, index) => (
              <a
                key={`${game.titulo}-${index}`}
                href={game.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group px-4 md:px-8 shrink-0 transition-transform active:scale-95"
              >
                <div className="relative h-6 w-9 md:h-8 md:w-12 shrink-0 overflow-hidden rounded-[2px] shadow-lg border border-white/10">
                  <img
                    className="h-full w-full object-cover"
                    src={game.foto}
                    alt={game.titulo}
                  />
                </div>

                <div className="ml-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors whitespace-nowrap uppercase tracking-tight">
                      {game.titulo}
                    </span>
                  </div>
                  <span className="hidden sm:block text-[8px] text-slate-500 font-medium mt-0.5">
                    EXPIRA EM{" "}
                    {new Date(game.data_fim)
                      .toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })
                      .toUpperCase()}
                  </span>
                </div>

                {(shouldAnimate || index !== games.length - 1) && (
                  <div className="ml-6 md:ml-12 text-white/5 font-thin select-none">
                    |
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
