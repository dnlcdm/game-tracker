import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import StarIcon from "@mui/icons-material/Star";
import { DIFFICULTY_CONFIG } from "../../playing/components/form-complete-game/contants/fields.constants";

interface StatsHeaderProps {
  totalCount: number;
  totalTimeLabel: string;
  avgRating: number;
  coopCount: number;
  avgDiff: number;
}

export const StatsHeader = ({
  totalCount,
  totalTimeLabel,
  avgRating,
  coopCount,
  avgDiff,
}: StatsHeaderProps) => {
  const ratingLabel = avgRating ? avgRating.toFixed(1) : "—";
  const diffLabel = avgDiff ? (DIFFICULTY_CONFIG[avgDiff]?.label ?? "—") : "—";

  return (
    <div className="relative overflow-hidden mx-4 mt-4 md:mt-0 md:mx-0 rounded-md border border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <SportsEsportsIcon className="text-blue-300" fontSize="small" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                Sua Coleção Finalizada
              </h2>
            </div>
          </div>

          <span className="shrink-0 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">
            {totalCount} títulos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
              Tempo
            </div>
            <div className="mt-1 flex items-center gap-2">
              <AccessTimeIcon sx={{ fontSize: 16 }} className="text-white/55" />
              <span className="text-white font-black text-sm">
                {totalTimeLabel}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
              Nota
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StarIcon sx={{ fontSize: 16 }} className="text-yellow-400" />
              <span className="text-white font-black text-sm">
                {ratingLabel}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
              Co-op
            </div>
            <div className="mt-1 flex items-center gap-2">
              <GroupsIcon sx={{ fontSize: 16 }} className="text-blue-300" />
              <span className="text-white font-black text-sm">{coopCount}</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
              Dific.
            </div>
            <div className="mt-1 flex items-center gap-2">
              <LocalFireDepartmentIcon
                sx={{ fontSize: 16 }}
                className="text-orange-300"
              />
              <span className="text-white font-black text-sm">
                {diffLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
