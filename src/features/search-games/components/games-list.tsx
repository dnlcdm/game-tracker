import { useDataGame } from "../hooks/useDataGames";

import type { IGames } from "../types/games.types";
import { useToggleBacklog } from "../hooks/useToggleBacklog";
import { GameGrid } from "../../../components/game-grid/game-grid";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useFetchBacklogGames } from "../../backlog/hooks/useFetchBacklogGames";
import { useFetchPlayingGames } from "../../playing/hooks/useFetchPlayingGames";
import { useMemo } from "react";

export const GamesList = () => {
  const { results, isPending, observerTarget, params } = useDataGame();
  const { mutate, isPending: isPendingMutate, variables } = useToggleBacklog();
  const { data: backlogData, isPending: isPendingBacklog } =
    useFetchBacklogGames();
  const { data: playingData, isPending: isPendingPlaying } =
    useFetchPlayingGames();

  const backlogMap = useMemo(
    () => new Map(backlogData?.map((g) => [String(g.id), g])),
    [backlogData],
  );
  const playingIds = useMemo(
    () => new Set(playingData?.map((g) => String(g.id))),
    [playingData],
  );

  const gameActions = useMemo(() => {
    const getGameState = (gameId: string) => {
      const isPlaying = playingIds.has(gameId);
      const isInBacklog = backlogMap.has(gameId);
      return { isPlaying, isInBacklog };
    };
    return [
      {
        label: (game: IGames) => {
          const { isPlaying, isInBacklog } = getGameState(String(game.id));
          if (isPlaying) return "Jogando";
          return isInBacklog ? "Remover da lista" : "Vou jogar";
        },

        icon: (game: IGames) => {
          const { isPlaying, isInBacklog } = getGameState(String(game.id));
          if (isPlaying)
            return (
              <div className="flex items-center justify-center text-xs px-1 pb-1">
                <p>Jogando</p>
              </div>
            );
          return isInBacklog ? (
            <BookmarkIcon fontSize="small" />
          ) : (
            <BookmarkBorderIcon fontSize="small" />
          );
        },

        colorClass: (game: IGames) => {
          const { isPlaying, isInBacklog } = getGameState(String(game.id));
          if (isPlaying) return "text-blue-400 md:hover:scale-100!";
          return isInBacklog
            ? "hover:text-green-400 md:hover:scale-105 md:hover:bg-gray-800"
            : "hover:text-blue-400 text-gray-400 md:hover:scale-105 md:hover:bg-gray-800";
        },

        onClick: (game: IGames) => {
          const { isPlaying } = getGameState(String(game.id));
          if (isPlaying) return null;
          return mutate(game);
        },
        isLoadingAction: (game: IGames) =>
          isPendingMutate && variables?.id === game.id,
      },
    ];
  }, [playingIds, backlogMap, mutate, isPendingMutate, variables?.id]);

  const isInitialLoading =
    (isPending || isPendingBacklog || isPendingPlaying) && params.page === "1";
  const showScrollLoader = isPending && params.page !== "1";

  return (
    <div className="min-h-screen w-full py-4 transition-all duration-500">
      <GameGrid
        items={results}
        actions={gameActions}
        isLoading={isInitialLoading}
      />

      <div
        ref={observerTarget}
        className="h-32 flex items-center justify-center w-full"
      >
        {showScrollLoader && (
          <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]"
                  style={{ animationDelay: `${i * -0.2}s` }}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Carregando mais jogos
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
