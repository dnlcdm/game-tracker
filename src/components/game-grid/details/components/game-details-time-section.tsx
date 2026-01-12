import type { ElementType } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TimeRow } from "../../time-row/time-row";

interface TimeRowData {
  label: string;
  time?: string;
  colorClass: string;
  icon: ElementType;
}

interface GameDetailsTimeSectionProps {
  rows: ReadonlyArray<TimeRowData>;
  isLoading: boolean;
}

export const GameDetailsTimeSection = ({
  rows,
  isLoading,
}: GameDetailsTimeSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1 opacity-70">
        <AccessTimeIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          Tempo Estimado
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {rows.map((row) => (
          <TimeRow key={row.label} {...row} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
};
