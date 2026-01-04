import { Fragment } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import type { IconContainerProps } from "@mui/material/Rating";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import { StyledRating } from "../../playing/components/form-complete-game/fields/difficult-input";
import { DIFFICULTY_CONFIG } from "../../playing/components/form-complete-game/contants/fields.constants";
import type { NamePopoverHandler } from "../types/game-stats.types";
import {
  formatDate,
  formatDateShort,
  formatTime,
} from "../utils/game-stats.utils";
import { GameNameButton } from "./game-name-button";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

interface MobileStatsTableProps {
  data?: IGamesSupabase[];
  expandedGameId: string | number | null;
  onToggleExpanded: (id: string | number) => void;
  onEdit: (game: IGamesSupabase) => void;
  onDelete: (game: IGamesSupabase) => void;
  onNameClick: NamePopoverHandler;
}

const IconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;
  return <span {...other}>{DIFFICULTY_CONFIG[value]?.icon}</span>;
};

export const MobileStatsTable = ({
  data,
  expandedGameId,
  onToggleExpanded,
  onEdit,
  onDelete,
  onNameClick,
}: MobileStatsTableProps) => {
  const list = data ?? [];

  return (
    <div className="relative overflow-hidden border border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[60%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
        </colgroup>

        <thead>
          <tr className="text-left border-b border-white/5 bg-white/[0.02]">
            <th className="px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
              Jogo
            </th>
            <th className="px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 text-right">
              Tempo
            </th>
            <th className="px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 text-right">
              Data
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/[0.03]">
          {list.map((game) => {
            const diff = DIFFICULTY_CONFIG[game.difficult];
            const isPlatinum = game.completion_type === "platinum";
            const isExpanded = expandedGameId === game.id;

            return (
              <Fragment key={game.id}>
                <tr
                  className={`transition-colors ${
                    isPlatinum
                      ? "bg-gradient-to-r from-yellow-500/15 via-amber-400/5 to-transparent"
                      : "hover:bg-blue-500/[0.03]"
                  }`}
                >
                  <td className="px-3 py-3 align-top">
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleExpanded(game.id)}
                        className="shrink-0 relative"
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded ? "Fechar detalhes" : "Abrir detalhes"
                        }
                      >
                        <img
                          src={game.coverUrl || "/not-found-image-1.png"}
                          className={`w-9 h-12 object-cover rounded-sm ring-1 border border-white/10 shadow-lg transition-all ${
                            isExpanded ? "ring-blue-400/40" : "ring-white/10"
                          }`}
                          alt={game.name}
                          loading="lazy"
                        />
                        {isPlatinum && (
                          <WorkspacePremiumIcon
                            className="absolute text-yellow-400 -top-1 -right-1 m-0 p-0"
                            fontSize="inherit"
                          />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-start">
                          <GameNameButton
                            name={game.name}
                            gameId={game.id}
                            onClick={onNameClick}
                            className="text-left text-[12px] font-black text-white uppercase italic truncate max-w-[100%]"
                          />
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[10px] text-white/45 min-w-0">
                          <span className="flex items-top font-bold uppercase text-white/60">
                            <StarIcon
                              className="text-yellow-400"
                              sx={{ fontSize: 13 }}
                            />
                            <span className="font-black ml-0.5 text-[11px]">
                              {game.user_rating}
                            </span>
                          </span>

                          {game.co_op_friend && (
                            <span className="inline-flex items-center gap-1 min-w-0">
                              <GroupsIcon
                                sx={{ fontSize: 14 }}
                                className="text-blue-300"
                              />
                              <span className="truncate max-w-[92px] font-bold uppercase tracking-wide text-blue-200/90">
                                {game.co_op_friend}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col items-end gap-1">
                      <div className="inline-flex items-center gap-1.5 text-white/70">
                        <AccessTimeIcon
                          sx={{ fontSize: 13 }}
                          className="text-white/30"
                        />
                        <span className="font-mono text-nowrap text-[11px] font-semibold">
                          {formatTime(game.minutes_played)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col items-end gap-1 text-white/70">
                      <span className="font-mono text-[11px]">
                        {game.completed_at
                          ? formatDateShort(game.completed_at)
                          : "--/--/--"}
                      </span>
                    </div>
                  </td>
                </tr>

                <tr className={isExpanded ? "" : "border-t-0"}>
                  <td colSpan={3}>
                    <div
                      aria-hidden={!isExpanded}
                      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                        isExpanded
                          ? "max-h-[600px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className={`transition-transform duration-300 ease-in-out ${
                          isExpanded ? "translate-y-0" : "-translate-y-2"
                        }`}
                      >
                        <div
                          className={`p-3 ${
                            isPlatinum
                              ? "bg-gradient-to-br from-yellow-500/15 via-white/[0.03] to-transparent border border-yellow-400/20 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.2)]"
                              : "bg-white/[0.03]"
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-white/45">
                            Detalhes
                          </div>

                          <div className="mt-2 text-xs text-white/90 font-black uppercase italic leading-snug">
                            {game.name}
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-white/5 bg-[#0B0F1A]/60 p-2">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-extrabold">
                                Dificuldade
                              </div>
                              <div className="mt-1 flex items-center gap-2">
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
                                  className={`text-[10px] font-black uppercase ${
                                    diff?.color ?? "text-white/60"
                                  }`}
                                >
                                  {diff?.label ?? "—"}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-[#0B0F1A]/60 p-2">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-extrabold">
                                Co-op
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-white/80">
                                <GroupsIcon
                                  sx={{ fontSize: 14 }}
                                  className="text-blue-300"
                                />
                                <span className="text-[11px] font-extrabold uppercase tracking-wide truncate">
                                  {game.co_op_friend
                                    ? game.co_op_friend
                                    : "Solo"}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-[#0B0F1A]/60 p-2">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-extrabold">
                                Tempo
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-white/80">
                                <AccessTimeIcon
                                  sx={{ fontSize: 14 }}
                                  className="text-white/30"
                                />
                                <span className="text-[11px] font-mono font-semibold">
                                  {formatTime(game.minutes_played)}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-[#0B0F1A]/60 p-2">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-extrabold">
                                Conclusão
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-white/80">
                                <CalendarMonthIcon
                                  sx={{ fontSize: 14 }}
                                  className="text-white/30"
                                />
                                <span className="text-[11px] font-mono">
                                  {game.completed_at
                                    ? formatDate(game.completed_at)
                                    : "---"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {game.review && (
                            <div className="relative mt-4 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F1A]/40 p-4">
                              <FormatQuoteIcon
                                className="absolute -right-1 -top-1 text-white/[0.03] transform rotate-12"
                                sx={{ fontSize: 60 }}
                              />

                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                  <FormatQuoteIcon
                                    className="text-blue-400/60 transform rotate-180"
                                    sx={{ fontSize: 16 }}
                                  />
                                  <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-blue-200/50">
                                    Review
                                  </span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-gray-300 italic pl-2 border-l-2 border-blue-500/20">
                                  "{game.review}"
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onDelete(game)}
                              className="mt-3 w-full rounded-lg border text-red-400 border-red-500/20 bg-red/[0.05] py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-white/[0.06] transition"
                            >
                              <span>Deletar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onEdit(game)}
                              className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/70 hover:bg-white/[0.06] transition"
                            >
                              editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
