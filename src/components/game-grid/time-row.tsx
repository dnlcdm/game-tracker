import type { ElementType } from "react";

const formatDuration = (seconds: number) => {
  if (!seconds) return "---";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  }
  return `${minutes}m`;
};

export const TimeRow = ({
  label,
  seconds,
  colorClass,
  icon: Icon,
}: {
  label: string;
  seconds?: number;
  colorClass: string;
  icon: ElementType;
}) => {
  if (!seconds) return null;

  return (
    <div className="group flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/[0.06] transition-colors relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass}`} />

      <div className="flex items-center gap-3 pl-2">
        <Icon
          className={`text-[18px] opacity-60 ${colorClass.replace("bg-", "text-")}`}
        />
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-mono font-bold text-white tracking-tight">
        {formatDuration(seconds)}
      </span>
    </div>
  );
};
