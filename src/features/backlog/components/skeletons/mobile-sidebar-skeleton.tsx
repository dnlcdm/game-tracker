export const MobileSidebarSkeleton = () => (
    <div className="md:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        {[1, 2, 3, 4].map((i) => (
            <div
                key={i}
                className="flex-shrink-0 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] animate-pulse"
                style={{ width: `${50 + i * 18}px` }}
            />
        ))}
    </div>
);
