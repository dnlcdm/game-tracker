import { useMemo } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { IGames, IGamesSupabase } from "../types/games.types";
import type { IGameAction } from "../../../components/game-grid/types";

type GameState = {
  isPlaying: boolean;
  isInBacklog: boolean;
  isCompleted: boolean;
  isPlatinum: boolean;
};

interface UseSearchGameActionsParams {
  backlogGames?: IGamesSupabase[];
  playingGames?: IGamesSupabase[];
  completedGames?: IGamesSupabase[];
  onToggleBacklog: (game: IGames) => void;
  isToggling: boolean;
  togglingGameId?: IGames["id"];
}

const buildIdMap = (games?: IGamesSupabase[]) =>
  new Map(games?.map((game) => [String(game.id), game]));

const buildIdSet = (games?: IGamesSupabase[]) =>
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
  const completedIds = useMemo(
    () => buildIdSet(completedGames),
    [completedGames]
  );

  const gameActions = useMemo<IGameAction[]>(() => {
    const getGameState = (game: IGames): GameState => {
      const gameId = String(game.id);
      return {
        isPlaying: playingIds.has(gameId),
        isInBacklog: backlogMap.has(gameId),
        isCompleted: completedIds.has(gameId),
        isPlatinum: !!completedGames?.some(
          (g) =>
            String(g.id) === String(game.id) && g.completion_type === "platinum"
        ),
      };
    };

    const canToggleBacklog = (state: GameState) =>
      !state.isPlaying && !state.isCompleted;

    return [
      {
        label: (game: IGames) => {
          const state = getGameState(game);
          if (!canToggleBacklog(state)) return "";
          return state.isInBacklog ? "Remover da lista" : "Jogarei";
        },
        gameStatus: (game: IGames) => {
          const state = getGameState(game);
          if (state.isPlaying) return "playing";
          if (state.isPlatinum) return "platinum";
          if (state.isCompleted) return "completed";
          if (state.isInBacklog) return "backlog";
          return "";
        },
        icon: (game: IGames) => {
          const state = getGameState(game);
          if (!canToggleBacklog(state)) return null;
          return state.isInBacklog ? <BookmarkIcon /> : <BookmarkBorderIcon />;
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
    playingIds,
    backlogMap,
    completedIds,
    completedGames,
    onToggleBacklog,
    isToggling,
    togglingGameId,
  ]);

  return { gameActions };
};
