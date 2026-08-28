import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import type { GameStatus, IGameAction } from "../types";
import {
  getStatusBorderClass,
  getStatusOverlayClass,
  hasMutedCover,
} from "../utils/game-status";
import { GameActionButton } from "./game-action-button";
import { GameStatusOverlay } from "./game-status-overlay";
import { useLongPress } from "../../../hooks/useLongPress";

interface GameGridCardProps {
  game: IGamesSupabase;
  status: GameStatus;
  actions?: IGameAction[];
  onSelect: (game: IGamesSupabase) => void;
  onListAssign?: (game: IGamesSupabase) => void;
}

export const GameGridCard = ({
  game,
  status,
  actions,
  onSelect,
  onListAssign,
}: GameGridCardProps) => {
  const longPress = useLongPress(
    () => onListAssign?.(game),
    {
      ms: 500,
      onStart: undefined,
      onCancel: undefined,
    },
  );

  const handleClick = () => {
    if (longPress.triggered.current) return;
    onSelect(game);
  };

  return (
    <div
      onClick={handleClick}
      {...(onListAssign
        ? {
            onTouchStart: longPress.onTouchStart,
            onTouchMove: longPress.onTouchMove,
            onTouchEnd: longPress.onTouchEnd,
          }
        : {})}
      data-testid="card-game"
      className={`relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-lg group bg-gray-900 active:scale-[0.98] transition-all duration-300
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
          {onListAssign && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onListAssign(game);
              }}
              className="hidden md:flex items-center justify-center w-6 h-6 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-white/50 opacity-0 group-hover:opacity-100 hover:!text-white hover:bg-black/70 transition-all duration-200"
              aria-label={`Gerenciar listas de ${game.name}`}
            >
              <MoreVertIcon sx={{ fontSize: 14 }} />
            </button>
          )}
          {actions?.map((action, index) => (
            <GameActionButton key={index} action={action} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

