import { useState } from "react";
import { useFetchGameStats } from "./hooks/useFetchGameStats";
import type { IGamesSupabase } from "../search-games/types/games.types";
import { FinishGameModal } from "../playing/components/form-complete-game/form-complete-game";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { EmptyState } from "../../components/empty-states/empty-states";

export const StatsTable = () => {
  const { data, isPending } = useFetchGameStats();
  const [selectedGameToFinish, setSelectedGameToFinish] =
    useState<IGamesSupabase | null>(null);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(dateStr));
  };

  if (isPending)
    return <div className="animate-pulse h-64 bg-gray-900/50 rounded-xl" />;

  if (data?.length === 0 && !isPending) return <EmptyState type="finished" />;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-gray-500 font-mono italic">
          {data?.length} Games Concluídos
        </span>
      </div>

      <div className="hidden md:block overflow-hidden rounded-md border border-white/5 bg-[#0B0F1A] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">
                Game
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-center">
                Nota
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">
                Tempo
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-right">
                Data
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-center w-20">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.map((game) => (
              <tr
                key={game.id}
                className="group hover:bg-blue-500/[0.03] transition-all duration-300"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={game.coverUrl}
                      className="w-10 h-14 object-cover rounded shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight italic">
                        {game.name}
                      </span>
                      {game.co_op_friend && (
                        <span className="text-[10px] text-blue-400/60 uppercase font-bold">
                          com {game.co_op_friend}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 w-fit mx-auto">
                    <span className="text-yellow-500 font-black text-sm">
                      {game.user_rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-400 group-hover:text-gray-300">
                    {formatTime(game.minutes_played)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400">
                    {game.completed_at ? formatDate(game.completed_at) : "---"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedGameToFinish(game)}
                    className="p-2 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all opacity-100 cursor-pointer"
                    title="Editar dados"
                  >
                    <EditNoteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data?.map((game) => (
          <div
            key={game.id}
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#111827] to-[#0B0F1A] p-5 shadow-xl"
          >
            <div
              onClick={() => setSelectedGameToFinish(game)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full border border-white/10 text-gray-400"
            >
              <div className="flex items-center justify-center">
                <EditNoteIcon className="p-0 m-0 ml-0.5" fontSize="small" />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <img
                src={game.coverUrl}
                className="w-16 h-24 object-cover rounded-lg shadow-2xl border border-white/10"
                alt=""
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter italic pr-8">
                  {game.name}
                </h3>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 rounded-md border border-yellow-500/20">
                    <span className="text-yellow-500 font-bold text-xs">
                      {game.user_rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-gray-400">
                    <span className="text-[10px] font-mono">
                      {formatTime(game.minutes_played)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600">
                {game.completed_at ? formatDate(game.completed_at) : "---"}
              </span>

              {game.co_op_friend && (
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-tighter">
                  com {game.co_op_friend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedGameToFinish && (
        <FinishGameModal
          game={selectedGameToFinish}
          isOpen={!!selectedGameToFinish}
          onClose={() => setSelectedGameToFinish(null)}
        />
      )}
    </div>
  );
};
