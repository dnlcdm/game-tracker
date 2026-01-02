import type { IGamesSupabase } from "../../search-games/types/games.types";

export const formatDateShort = (dateStr: string) => {
  if (!dateStr) return "--/--/--";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(dateStr));
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "---";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateStr));
};

export const formatTime = (minutes: number) => {
  const safe = Number.isFinite(minutes) ? minutes : 0;
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h${m > 0 ? `${m}m` : ""}`;
};

export const getQuickStats = (list: IGamesSupabase[]) => {
  const totalMinutes = list.reduce(
    (acc, game) => acc + (game.minutes_played ?? 0),
    0,
  );
  const avgRating =
    list.length > 0
      ? list.reduce((acc, game) => acc + (Number(game.user_rating) || 0), 0) /
        list.length
      : 0;
  const coopCount = list.filter((game) => !!game.co_op_friend).length;
  const avgDiff =
    list.length > 0
      ? Math.round(
          list.reduce((acc, game) => acc + (Number(game.difficult) || 0), 0) /
            list.length,
        )
      : 0;

  return { totalMinutes, avgRating, coopCount, avgDiff };
};

export const getTotalTimeLabel = (totalMinutes: number) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h${m ? ` ${m}m` : ""}`;
};
