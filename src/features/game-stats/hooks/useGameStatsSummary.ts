import { useMemo } from "react";
import type { IGamesSupabase } from "../../search-games/types/games.types";
import { getQuickStats, getTotalTimeLabel } from "../utils/game-stats.utils";

export const useGameStatsSummary = (data?: IGamesSupabase[]) => {
  const quickStats = useMemo(() => getQuickStats(data ?? []), [data]);
  const totalTimeLabel = useMemo(
    () => getTotalTimeLabel(quickStats.totalMinutes),
    [quickStats.totalMinutes],
  );

  return { quickStats, totalTimeLabel };
};
