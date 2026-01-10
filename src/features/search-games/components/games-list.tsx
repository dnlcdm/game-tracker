import { useDataGame } from "../hooks/useDataGames";

import { useToggleBacklog } from "../hooks/useToggleBacklog";
import { GameGrid } from "../../../components/game-grid/grid/game-grid";
import { useFetchBacklogGames } from "../../backlog/hooks/useFetchBacklogGames";
import { useFetchPlayingGames } from "../../playing/hooks/useFetchPlayingGames";
import { useFetchGameStats } from "../../game-stats/hooks/useFetchGameStats";
import { useSearchGameActions } from "../hooks/useSearchGameActions";
import type { RefObject } from "react";
import type { IGamesSupabase } from "../types/games.types";
import { EmptyState } from "../../../components/empty-states/empty-states";

interface GamesListFooterProps {
  observerTarget: RefObject<HTMLDivElement | null>;
  showScrollLoader: boolean;
  showEndOfResults: boolean;
}

const GamesListFooter = ({
  observerTarget,
  showScrollLoader,
  showEndOfResults,
}: GamesListFooterProps) => (
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
    {showEndOfResults && (
      <div className="flex flex-col w-full items-center gap-2 opacity-50">
        <div className="h-[1px] w-full bg-gray-700" />
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
          Fim da pesquisa
        </span>
      </div>
    )}
  </div>
);

export const GamesList = () => {
  const { results, isPending, observerTarget, params, hasMore } = useDataGame();
  const { mutate, isPending: isPendingMutate, variables } = useToggleBacklog();
  const { data: backlogData, isPending: isPendingBacklog } =
    useFetchBacklogGames();
  const { data: playingData, isPending: isPendingPlaying } =
    useFetchPlayingGames();
  const { data: completedData } = useFetchGameStats();

  const { gameActions } = useSearchGameActions({
    backlogGames: backlogData,
    playingGames: playingData,
    completedGames: completedData,
    onToggleBacklog: mutate,
    isToggling: isPendingMutate,
    togglingGameId: variables?.id,
  });
  const isInitialLoading =
    (isPending || isPendingBacklog || isPendingPlaying) && params.page === "1";
  const isEmpty = results?.length === 0 && !isInitialLoading && !isPending;
  const showScrollLoader = isPending && params.page !== "1";
  const showEndOfResults = !hasMore && results.length > 0;

  return (
    <div className="min-h-screen w-full py-4 transition-all duration-500">
      {isEmpty ? (
        <EmptyState type="search" />
      ) : (
        <GameGrid
          items={results as IGamesSupabase[]}
          actions={gameActions}
          isLoading={isInitialLoading}
        />
      )}

      <GamesListFooter
        observerTarget={observerTarget}
        showScrollLoader={showScrollLoader}
        showEndOfResults={showEndOfResults}
      />
    </div>
  );
};
