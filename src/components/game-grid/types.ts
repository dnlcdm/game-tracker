import type { ReactNode } from "react";
import type { IGames } from "../../features/search-games/types/games.types";

export type GameStatus =
  | "playing"
  | "completed"
  | "platinum"
  | "backlog"
  | string;

export interface IGameAction {
  icon: (game: IGames) => ReactNode;
  label: (game: IGames) => string;
  onClick: (game: IGames) => void | null;
  colorClass?: (game: IGames) => string;
  isLoadingAction?: (game: IGames) => boolean;
  gameStatus: (game: IGames) => GameStatus;
}
