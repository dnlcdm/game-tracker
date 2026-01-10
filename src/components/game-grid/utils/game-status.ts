import type { GameStatus } from "../types";

export const getStatusBorderClass = (status: GameStatus) => {
  if (status === "playing") {
    return "border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]";
  }

  if (status === "platinum") {
    return "border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)]";
  }

  if (status === "completed") {
    return "border-2 border-green-500/50";
  }

  return "";
};

export const getStatusOverlayClass = (status: GameStatus) =>
  status === "playing"
    ? "bg-gradient-to-t from-cyan-900/90 via-transparent to-transparent opacity-80"
    : "bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100";

export const hasMutedCover = (status: GameStatus) =>
  status === "completed" || status === "platinum" || status === "playing";
