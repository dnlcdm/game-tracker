import type { MouseEvent } from "react";

export type MobileViewMode = "cards" | "table";

export type NamePopoverHandler = (
  event: MouseEvent<HTMLElement>,
  gameId: string | number,
  fullName: string,
) => void;
