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
  const coopCount = list.filter((game) => !!game.co_op_friend).length;
  const totalPlatinum = list.filter(
    (game) => game.completion_type === "platinum",
  ).length;
  const avgDiff =
    list.length > 0
      ? Math.round(
          list.reduce((acc, game) => acc + (Number(game.difficult) || 0), 0) /
            list.length,
        )
      : 0;

  return { totalMinutes, coopCount, avgDiff, totalPlatinum };
};

export const getTotalTimeLabel = (totalMinutes: number) => {
  const minsInHour = 60;
  const minsInDay = minsInHour * 24;
  const minsInMonth = minsInDay * 30;
  const minsInYear = minsInDay * 365;

  const years = Math.floor(totalMinutes / minsInYear);
  let remainder = totalMinutes % minsInYear;

  const months = Math.floor(remainder / minsInMonth);
  remainder %= minsInMonth;

  const days = Math.floor(remainder / minsInDay);
  remainder %= minsInDay;

  const hrs = Math.floor(remainder / minsInHour);
  const mins = remainder % minsInHour;

  return { years, months, days, hrs, mins };
};
