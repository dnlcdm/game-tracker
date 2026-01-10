interface GameGridSkeletonProps {
  className: string;
  count?: number;
}

export const GameGridSkeleton = ({
  className,
  count = 28,
}: GameGridSkeletonProps) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-[3/4] bg-gray-800/50 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
};
