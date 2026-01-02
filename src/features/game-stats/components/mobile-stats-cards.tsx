import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import type { IconContainerProps } from "@mui/material/Rating";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import { StyledRating } from "../../playing/components/form-complete-game/fields/difficult-input";
import { DIFFICULTY_CONFIG } from "../../playing/components/form-complete-game/contants/fields.constants";
import type { NamePopoverHandler } from "../types/game-stats.types";
import { formatDate, formatTime } from "../utils/game-stats.utils";
import { GameNameButton } from "./game-name-button";

interface MobileStatsCardsProps {
  data?: IGamesSupabase[];
  onEdit: (game: IGamesSupabase) => void;
  onNameClick: NamePopoverHandler;
}

const IconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;
  return <span {...other}>{DIFFICULTY_CONFIG[value]?.icon}</span>;
};

export const MobileStatsCards = ({
  data,
  onEdit,
  onNameClick,
}: MobileStatsCardsProps) => {
  const list = data ?? [];

  return (
    <div className="grid p-2 grid-cols-1 gap-3">
      {list.map((game) => {
        const diff = DIFFICULTY_CONFIG[game.difficult];
        return (
          <div
            key={game.id}
            className="relative overflow-hidden rounded-md border border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 active:scale-[0.99] transition-transform"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative p-3.5 flex gap-3.5">
              <img
                src={game.coverUrl}
                className="w-16 h-24 object-cover rounded-md shadow-2xl border border-white/10 shrink-0"
                alt={game.name}
                loading="lazy"
              />

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <GameNameButton
                      name={game.name}
                      gameId={game.id}
                      onClick={onNameClick}
                      className="text-left text-sm font-black text-white uppercase italic truncate max-w-[220px]"
                    />

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 text-yellow-300 bg-yellow-500/5 px-2.5 py-1 rounded-full border border-yellow-500/10">
                        <StarIcon sx={{ fontSize: 14 }} />
                        <span className="text-xs font-black">
                          {game.user_rating ?? "—"}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-white/70 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/5">
                        <AccessTimeIcon
                          sx={{ fontSize: 14 }}
                          className="text-white/35"
                        />
                        <span className="text-xs font-mono font-semibold">
                          {formatTime(game.minutes_played)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onEdit(game)}
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-2xl text-white/45 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    title="Editar"
                  >
                    <EditNoteIcon fontSize="medium" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <div className="flex justify-between items-center">
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
                      <span
                        className={`text-[10px] font-black uppercase ${diff?.color ?? "text-white/70"}`}
                      >
                        {diff?.label ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <GroupsIcon
                        sx={{ fontSize: 16 }}
                        className="text-blue-300"
                      />
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">
                        Co-op
                      </span>
                    </div>

                    {game.co_op_friend ? (
                      <span className="text-xs font-black text-blue-200 uppercase tracking-wider truncate max-w-[150px]">
                        {game.co_op_friend}
                      </span>
                    ) : (
                      <span className="text-xs text-white/35">—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3.5 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <CalendarMonthIcon
                  sx={{ fontSize: 16 }}
                  className="text-white/35"
                />
                <span className="text-[11px] font-mono tracking-wide">
                  {game.completed_at ? formatDate(game.completed_at) : "---"}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/35">
                finished
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
