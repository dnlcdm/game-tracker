import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import type { MobileViewMode } from "../types/game-stats.types";

interface MobileViewToggleProps {
  value: MobileViewMode;
  onChange: (value: MobileViewMode) => void;
}

export const MobileViewToggle = ({
  value,
  onChange,
}: MobileViewToggleProps) => (
  <div className="md:hidden flex mx-2 items-end justify-between">
    <p className="text-[10px] font-extrabold italic text-white/60">
      {value == "table" && "Toque na capa para mais detalhes"}
    </p>
    <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      <button
        type="button"
        aria-pressed={value === "cards"}
        onClick={() => onChange("cards")}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all ${
          value === "cards"
            ? "bg-white/10 text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        <ViewAgendaIcon sx={{ fontSize: 16 }} />
        Cards
      </button>

      <button
        type="button"
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all ${
          value === "table"
            ? "bg-white/10 text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        <TableRowsIcon sx={{ fontSize: 16 }} />
        Tabela
      </button>
    </div>
  </div>
);
