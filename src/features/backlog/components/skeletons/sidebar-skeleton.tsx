export const SidebarSkeleton = () => (
    <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-white/[0.06] bg-gray-950/50">
        <nav className="flex-1 px-2 py-3 space-y-3">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                    <div className="h-4 w-4 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-3.5 flex-1 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-3 w-5 rounded bg-white/[0.04] animate-pulse" />
                </div>
            ))}

            <div className="px-2 pb-1 pt-2">
                <div className="h-2.5 w-12 rounded bg-white/[0.05] animate-pulse" />
            </div>

            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-2">
                    <div className="h-3.5 w-3.5 rounded bg-white/[0.04] animate-pulse" />
                    <div
                        className="h-3.5 flex-1 rounded bg-white/[0.06] animate-pulse"
                        style={{ maxWidth: `${60 + i * 20}px` }}
                    />
                    <div className="h-3 w-4 rounded bg-white/[0.04] animate-pulse" />
                </div>
            ))}
        </nav>

        <div className="px-2 pb-3 border-t border-white/[0.06] pt-2">
            <div className="flex items-center gap-2 px-3 py-2">
                <div className="h-4 w-4 rounded bg-white/[0.04] animate-pulse" />
                <div className="h-3 w-16 rounded bg-white/[0.05] animate-pulse" />
            </div>
        </div>
    </aside>
);
