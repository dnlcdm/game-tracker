import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import type { GameStatus, IGameAction } from "../types";
import {
  getStatusBorderClass,
  getStatusOverlayClass,
  hasMutedCover,
} from "../utils/game-status";
import { GameActionButton } from "./components/game-action-button";
import { GameStatusOverlay } from "./components/game-status-overlay";

interface GameGridCardProps {
  game: IGamesSupabase;
  status: GameStatus;
  actions?: IGameAction[];
  onSelect: (game: IGamesSupabase) => void;
}

export const GameGridCard = ({
  game,
  status,
  actions,
  onSelect,
}: GameGridCardProps) => {
  return (
    <div
      onClick={() => onSelect(game)}
      className={`relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg group bg-gray-900 active:scale-[0.98] transition-all duration-300
        ${getStatusBorderClass(status)}
      `}
    >
      <img
        src={game.coverUrl || "/not-found-image-1.png"}
        className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
      />

      <img
        src={game.coverUrl || "/not-found-image-1.png"}
        alt={game.name}
        loading="lazy"
        className={`absolute inset-0 m-auto w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105 ${hasMutedCover(status) ? "grayscale-[0.4] brightness-[0.6]" : ""}`}
      />

      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${getStatusOverlayClass(
          status,
        )}`}
      />

      <GameStatusOverlay status={status} />

      <div className="absolute inset-0 z-30 flex flex-col justify-end p-3">
        <span className="text-[11px] sm:text-xs font-black text-white line-clamp-2 leading-tight uppercase tracking-wider drop-shadow-md mb-1">
          {game.name}
        </span>

        <div className="absolute flex gap-1.5 top-1 right-1 opacity-100 transition-opacity duration-300">
          {actions?.map((action, index) => (
            <GameActionButton key={index} action={action} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};
