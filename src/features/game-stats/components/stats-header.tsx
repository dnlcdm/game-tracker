import GroupsIcon from "@mui/icons-material/Groups";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import type { ReactNode } from "react";

interface StatsHeaderProps {
  totalCount: number;
  totalPlatinum: number;
  totalTimeLabel: {
    years: number;
    months: number;
    days: number;
    hrs: number;
    mins: number;
  };
  coopCount: number;
  avgDiff: number;
}
const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  if (label === "Anos" && value === 0) return null;
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="relative bg-[#1a1f2e] md:px-4 lg:px-8 border border-white/10 rounded-sm px-2 py-1.5 shadow-inner">
          <div className="absolute inset-x-0 top-1/2 md:h-0.5 h-px bg-black/40 translate-y-1/2" />
          <span className="text-3xl lg:text-6xl font-mono font-black text-white tracking-tighter tabular-nums leading-none">
            {String(value).padStart(2, "0")}
          </span>
        </div>
        <span className="text-[8px] md:text-[12px] uppercase tracking-widest text-white/40 font-bold">
          {label}
        </span>
      </div>
    </>
  );
};

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) => (
  <div className="flex flex-col items-center md:items-center min-w-[70px]">
    <div className="flex items-center gap-1.5">
      <span className="text-2xl md:text-4xl">{icon}</span>
      <span className="text-[9px] md:text-lg uppercase tracking-[0.15em] text-white/40 font-black md:font-bold">
        {label}
      </span>
    </div>
    <span className="text-lg md:text-3xl font-black md:font-semibold text-white leading-none">
      {value}
    </span>
  </div>
);

export const StatsHeader = ({
  totalCount,
  totalTimeLabel,
  totalPlatinum,
  coopCount,
}: StatsHeaderProps) => {
  const { years, months, days, hrs, mins } = totalTimeLabel;

  return (
    <div className="relative overflow-hidden mx-4 mt-4 md:mt-0 md:mb-6 md:mx-0 rounded-lg border border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative p-4 md:p-0 sm:p-6">
        <div className="flex flex-col  gap-6 md:gap-8">
          <div className="flex-1 flex flex-col md:p-4 items-center md:items-start gap-3">
            <div className="flex items-center gap-2 text-white/50">
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <h2 className="uppercase font-black md:text-lg text-xs italic tracking-[0.2em]">
                Tempo Total de Jogo
              </h2>
            </div>

            <div className="flex items-center justify-around w-auto md:gap-8 md:w-auto md:justify-start gap-2 md:bg-transparent p-0 rounded-xl md:border-none">
              <TimeUnit value={years} label="Anos" />
              <TimeUnit value={months} label="Meses" />
              <TimeUnit value={days} label="Dias" />
              <TimeUnit value={hrs} label="Horas" />
              <TimeUnit value={mins} label="Minutos" />
            </div>
          </div>

          <div className="grid grid-cols-3 md:p-4 md:flex gap-3 md:gap-8 md:bg-white/3">
            <StatItem
              icon={
                <WorkspacePremiumIcon
                  fontSize="inherit"
                  className="text-yellow-400"
                />
              }
              label="Platinas"
              value={totalPlatinum}
            />
            <StatItem
              icon={
                <SportsEsportsIcon
                  fontSize="inherit"
                  className="text-blue-400"
                />
              }
              label="Zerados"
              value={totalCount}
            />
            <StatItem
              icon={
                <GroupsIcon fontSize="inherit" className="text-purple-400" />
              }
              label="Co-op"
              value={coopCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
