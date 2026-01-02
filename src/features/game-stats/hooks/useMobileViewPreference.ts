import { useEffect, useState } from "react";
import type { MobileViewMode } from "../types/game-stats.types";

const STORAGE_KEY = "stats_mobile_view";

export const useMobileViewPreference = (
  initialView: MobileViewMode = "cards",
) => {
  const [mobileView, setMobileView] = useState<MobileViewMode>(initialView);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as MobileViewMode | null;
    if (saved === "cards" || saved === "table") setMobileView(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mobileView);
  }, [mobileView]);

  return { mobileView, setMobileView };
};
