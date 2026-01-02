import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { IconContainerProps } from "@mui/material/Rating";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import { StyledRating } from "../../playing/components/form-complete-game/fields/difficult-input";
import { DIFFICULTY_CONFIG } from "../../playing/components/form-complete-game/contants/fields.constants";
import type { NamePopoverHandler } from "../types/game-stats.types";
import { formatDate, formatTime } from "../utils/game-stats.utils";
import { GameNameButton } from "./game-name-button";

interface DesktopStatsTableProps {
  data?: IGamesSupabase[];
  onEdit: (game: IGamesSupabase) => void;
  onNameClick: NamePopoverHandler;
}

const IconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;
  return <span {...other}>{DIFFICULTY_CONFIG[value]?.icon}</span>;
};

export const DesktopStatsTable = ({
  data,
  onEdit,
  onNameClick,
}: DesktopStatsTableProps) => {
  const list = data ?? [];

  return (
    <div className="hidden md:block overflow-hidden rounded-md border border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                Jogo
              </th>
              <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 text-center">
                Nota
              </th>
              <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                Dificuldade
              </th>
              <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                Tempo
              </th>
              <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                Conclusão
              </th>
              <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {list.map((game) => {
              const diff = DIFFICULTY_CONFIG[game.difficult];
              return (
                <tr
                  key={game.id}
                  className="group hover:bg-blue-500/[0.03] transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={game.coverUrl}
                        className="w-10 h-14 object-cover rounded-md ring-1 ring-white/10 shrink-0"
                        alt={game.name}
                        loading="lazy"
                      />

                      <div className="min-w-0">
                        <GameNameButton
                          name={game.name}
                          gameId={game.id}
                          onClick={onNameClick}
                          className="text-left font-black text-gray-100 group-hover:text-blue-300 transition-colors text-xs tracking-tight italic uppercase truncate max-w-[320px]"
                        />

                        <div className="text-[11px] text-white/45 mt-0.5 truncate max-w-[320px]">
                          {game.co_op_friend && `feat. ${game.co_op_friend}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {game.user_rating && (
                      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/5">
                          {game.user_rating}/10
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-between items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                      <StyledRating
                        size="small"
                        value={game.difficult}
                        IconContainerComponent={IconContainer}
                        getLabelText={(val) =>
                          DIFFICULTY_CONFIG[val]?.label ?? ""
                        }
                        highlightSelectedOnly
                        readOnly
                      />
                      <p
                        className={`text-[10px] font-black uppercase ${diff?.color ?? "text-white/70"}`}
                      >
                        {diff?.label ?? "—"}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-white/70">
                      <AccessTimeIcon
                        sx={{ fontSize: 14 }}
                        className="text-white/35"
                      />
                      <span className="font-mono text-xs font-semibold">
                        {formatTime(game.minutes_played)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-white/70">
                      <CalendarMonthIcon
                        sx={{ fontSize: 14 }}
                        className="text-white/35"
                      />
                      <span className="font-mono text-xs">
                        {game.completed_at
                          ? formatDate(game.completed_at)
                          : "---"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit(game)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white/45 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Editar"
                    >
                      <EditNoteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
