import { useFetchGameStats } from "./hooks/useFetchGameStats";

export const StatsTablea = () => {
  const { data } = useFetchGameStats();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800 bg-[#111827]">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-900/50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4 font-medium">Jogo</th>
            <th className="px-6 py-4 font-medium text-center">Nota</th>
            <th className="px-6 py-4 font-medium">Tempo Total</th>
            <th className="px-6 py-4 font-medium">Companheiro</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data?.map((game) => (
            <tr
              key={game.id}
              className="hover:bg-gray-800/30 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-white uppercase tracking-tight">
                {game.name}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="flex items-center justify-center gap-1 text-yellow-500">
                  {game.user_rating}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {game.minutes_played}
              </td>
              <td className="px-6 py-4 italic text-blue-400/80">
                {game.co_op_friend ? `Com ${game.co_op_friend}` : "Solo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const StatsTable = () => {
  const { data, isLoading } = useFetchGameStats();

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading)
    return <div className="animate-pulse h-64 bg-gray-900/50 rounded-xl" />;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-gray-500 font-mono">
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
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">
                Jornada
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-right">
                Data
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
                    <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">
                      {game.name}
                    </span>
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
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300">
                    <span className="font-mono text-sm">
                      {formatTime(game.minutes_played)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {game.co_op_friend ? (
                    <div className="flex items-center gap-2 text-blue-400/80 bg-blue-500/5 w-fit px-3 py-1 rounded-md border border-blue-500/10">
                      <span className="text-xs font-medium">
                        com {game.co_op_friend}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600 font-medium uppercase tracking-widest">
                      Solo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400">
                    {game.completed_at ? formatDate(game.completed_at) : "---"}
                  </span>
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
            <div className="flex items-start gap-4">
              <img
                src={game.coverUrl}
                className="w-16 h-24 object-cover rounded-lg shadow-2xl border border-white/10"
                alt=""
              />
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">
                  {game.name}
                </h3>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
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
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {game.completed_at ? formatDate(game.completed_at) : "---"}
                </span>
              </div>
              {game.co_op_friend && (
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-tighter">
                  com {game.co_op_friend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
