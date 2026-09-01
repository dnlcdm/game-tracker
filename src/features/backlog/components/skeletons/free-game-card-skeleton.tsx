export const FreeGameCardSkeleton = () => (
    <div className="w-full bg-slate-950/90 border-b border-white/5 sticky top-0 z-50 overflow-hidden">
        <div className="flex items-center max-w-[1920px] mx-auto">
            <div className="z-20 bg-slate-950 pr-3 pl-4 md:px-6 flex items-center gap-2 border-r border-white/10 shrink-0 shadow-[10px_0_20px_rgba(0,0,0,0.8)]">
                <div className="h-2 w-2 rounded-full bg-white/10 animate-pulse" />
                <div className="h-3 w-4 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="flex-1 flex items-center gap-6 py-2 md:py-3 px-4 md:px-8 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 shrink-0">
                        <div className="h-6 w-9 md:h-8 md:w-12 rounded-[2px] bg-white/[0.06] animate-pulse" />
                        <div className="flex flex-col gap-1">
                            <div className="h-3 w-20 md:w-28 rounded bg-white/[0.06] animate-pulse" />
                            <div className="hidden sm:block h-2 w-14 rounded bg-white/[0.04] animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
