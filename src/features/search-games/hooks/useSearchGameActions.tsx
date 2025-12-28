import { useMemo } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { IGames } from "../types/games.types";
import type { IGameAction } from "../../../components/game-grid/types";

type GameState = {
  isPlaying: boolean;
  isInBacklog: boolean;
  isCompleted: boolean;
};

interface UseSearchGameActionsParams {
  backlogGames?: IGames[];
  playingGames?: IGames[];
  completedGames?: IGames[];
  onToggleBacklog: (game: IGames) => void;
  isToggling: boolean;
  togglingGameId?: IGames["id"];
}

const buildIdMap = (games?: IGames[]) =>
  new Map(games?.map((game) => [String(game.id), game]));

const buildIdSet = (games?: IGames[]) =>
  new Set(games?.map((game) => String(game.id)));

export const useSearchGameActions = ({
  backlogGames,
  playingGames,
  completedGames,
  onToggleBacklog,
  isToggling,
  togglingGameId,
}: UseSearchGameActionsParams) => {
  const backlogMap = useMemo(() => buildIdMap(backlogGames), [backlogGames]);
  const playingIds = useMemo(() => buildIdSet(playingGames), [playingGames]);
  const completedIds = useMemo(() => buildIdSet(completedGames), [completedGames]);

  const gameActions = useMemo<IGameAction[]>(() => {
    const getGameState = (game: IGames): GameState => {
      const gameId = String(game.id);
      return {
        isPlaying: playingIds.has(gameId),
        isInBacklog: backlogMap.has(gameId),
        isCompleted: completedIds.has(gameId),
      };
    };

    const canToggleBacklog = (state: GameState) =>
      !state.isPlaying && !state.isCompleted;

    return [
      {
        label: (game: IGames) => {
          const state = getGameState(game);
          if (!canToggleBacklog(state)) return "";
          return state.isInBacklog ? "Remover da lista" : "Vou jogar";
        },
        gameStatus: (game: IGames) => {
          const state = getGameState(game);
          if (state.isPlaying) return "playing";
          if (state.isCompleted) return "completed";
          if (state.isInBacklog) return "backlog";
          return "";
        },
        icon: (game: IGames) => {
          const state = getGameState(game);
          if (!canToggleBacklog(state)) return null;
          return state.isInBacklog ? <BookmarkIcon />  : <BookmarkBorderIcon/> ;
        },
        colorClass: (game: IGames) => {
          const state = getGameState(game);
          if (state.isPlaying) {
            return "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
          }
          return state.isInBacklog
            ? "hover:text-green-400 md:hover:scale-105 md:hover:bg-gray-800"
            : "hover:text-blue-400 text-gray-400 md:hover:scale-105 md:hover:bg-gray-800";
        },
        onClick: (game: IGames) => {
          const state = getGameState(game);
          if (!canToggleBacklog(state)) return null;
          return onToggleBacklog(game);
        },
        isLoadingAction: (game: IGames) =>
          isToggling && togglingGameId === game.id,
      },
    ];
  }, [
    backlogMap,
    completedIds,
    onToggleBacklog,
    isToggling,
    playingIds,
    togglingGameId,
  ]);

  return { gameActions };
};
