import type { ReactNode } from "react";
import type { IGamesSupabase } from "../../features/search-games/types/games.types";

export type GameStatus =
  | "playing"
  | "completed"
  | "platinum"
  | "backlog"
  | string;

export interface IGameAction {
  icon: (game: IGamesSupabase) => ReactNode;
  label: (game: IGamesSupabase) => string;
  onClick: (game: IGamesSupabase) => void | null;
  colorClass?: (game: IGamesSupabase) => string;
  isLoadingAction?: (game: IGamesSupabase) => boolean;
  gameStatus: (game: IGamesSupabase) => GameStatus;
}
