import { useDataGame } from "../hooks/useDataGames";

import type { IGames } from "../types/games.types";
import { useToggleBacklog } from "../hooks/useToggleBacklog";
import { GameGrid } from "../../../components/game-grid/game-grid";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useFetchBacklogGames } from "../../backlog/hooks/useFetchBacklogGames";
import { useFetchPlayingGames } from "../../playing/hooks/useFetchPlayingGames";
import { useMemo } from "react";
import { useFetchGameStats } from "../../game-stats/hooks/useFetchGameStats";

export const GamesList = () => {
  const { results, isPending, observerTarget, params, hasMore } = useDataGame();
  const { mutate, isPending: isPendingMutate, variables } = useToggleBacklog();
  const { data: backlogData, isPending: isPendingBacklog } =
    useFetchBacklogGames();
  const { data: playingData, isPending: isPendingPlaying } =
    useFetchPlayingGames();
  const { data: completedData } = useFetchGameStats();

  const backlogMap = useMemo(
    () => new Map(backlogData?.map((g) => [String(g.id), g])),
    [backlogData],
  );

  const completedIds = useMemo(
    () => new Set(completedData?.map((g) => String(g.id))),
    [completedData],
  );

  const playingIds = useMemo(
    () => new Set(playingData?.map((g) => String(g.id))),
    [playingData],
  );

  const gameActions = useMemo(() => {
    const getGameState = (gameId: string) => {
      const isPlaying = playingIds.has(gameId);
      const isInBacklog = backlogMap.has(gameId);
      const isCompleted = completedIds.has(gameId);
      return { isPlaying, isInBacklog, isCompleted };
    };
    return [
      {
        label: (game: IGames) => {
          const { isPlaying, isInBacklog, isCompleted } = getGameState(
            String(game.id),
          );
          if (isPlaying) return "";
          if (isCompleted) return "";
          return isInBacklog ? "Remover da lista" : "Vou jogar";
        },

        gameStatus: (game: IGames) => {
          const { isPlaying, isInBacklog, isCompleted } = getGameState(
            String(game.id),
          );
          if (isPlaying) return "playing";
          if (isCompleted) return "completed";
          if (isInBacklog) return "backlog";
          return "";
        },
        icon: (game: IGames) => {
          const { isPlaying, isInBacklog, isCompleted } = getGameState(String(game.id));
          if (isPlaying) return null;

          if (isCompleted) return null;
          return isInBacklog ? <BookmarkIcon /> : <BookmarkBorderIcon />;
        },

        colorClass: (game: IGames) => {
          const { isPlaying, isInBacklog } = getGameState(String(game.id));
          if (isPlaying)
            return "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
          return isInBacklog
            ? "hover:text-green-400 md:hover:scale-105 md:hover:bg-gray-800"
            : "hover:text-blue-400 text-gray-400 md:hover:scale-105 md:hover:bg-gray-800";
        },

        onClick: (game: IGames) => {
          const { isPlaying, isCompleted } = getGameState(String(game.id));
          if (isPlaying) return null;
          if (isCompleted) return null;
          return mutate(game);
        },
        isLoadingAction: (game: IGames) =>
          isPendingMutate && variables?.id === game.id,
      },
    ];
  }, [playingIds, backlogMap, completedIds, mutate, isPendingMutate, variables?.id]);

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
        {!hasMore && results.length > 0 && (
          <div className="flex flex-col w-full items-center gap-2 opacity-50">
            <div className="h-[1px] w-full bg-gray-700" />
            <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
              Fim da pesquisa
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
