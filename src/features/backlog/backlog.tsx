import { useCallback, useMemo, useState } from "react";
import { GameGrid } from "../../components/game-grid/grid/game-grid";
import { useUpdatePlayingGame } from "../playing/hooks/useUpdatePlayingGame";
import type {
  IGames,
  IGamesSupabase,
} from "../search-games/types/games.types";
import { useDeleteBacklogGame } from "./hooks/useDeleteBacklogGame";
import { useFetchBacklogGames } from "./hooks/useFetchBacklogGames";
import { useFetchLists } from "./hooks/useFetchLists";
import { useFetchListItems } from "./hooks/useFetchListItems";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { FreeGameCard } from "../../components/free-game-card/free-game-card";
import { EmptyState } from "../../components/empty-states/empty-states";
import { Toast } from "../../components/snackbar/toast";
import { useToast } from "../../components/snackbar/hooks/useToast";
import { ConfirmationModal } from "../../components/confirmation-modal/confirmation-modal";
import { BacklogListsSidebar } from "./components/backlog-lists-sidebar";
import { ListAssignModal } from "./components/list-assign-modal";

const SELECTED_LIST_KEY = "backlog-selected-list";

export const Backlog = () => {
  const { data, isPending, isError, isSuccess, isFetching, error } =
    useFetchBacklogGames();

  const { data: lists = [] } = useFetchLists();
  const { data: listItems = [] } = useFetchListItems();

  const {
    mutate: deleteBacklog,
    variables: deletingId,
    isPending: isDeleting,
  } = useDeleteBacklogGame();

  const {
    mutate: moveToPlaying,
    isPending: isMoving,
    variables: movingId,
  } = useUpdatePlayingGame("playing");
  const { open, message, severity, showToast, hideToast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const [gameIdToDelete, setGameIdToDelete] = useState<number | null>(null);
  const [assignGame, setAssignGame] = useState<IGamesSupabase | null>(null);

  const [selectedListId, setSelectedListId] = useState<string | null>(() => {
    const stored = localStorage.getItem(SELECTED_LIST_KEY);
    return stored || null;
  });

  const handleSelectList = useCallback((listId: string | null) => {
    setSelectedListId(listId);
    if (listId) {
      localStorage.setItem(SELECTED_LIST_KEY, listId);
    } else {
      localStorage.removeItem(SELECTED_LIST_KEY);
    }
  }, []);

  const gameCountByList = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of listItems) {
      counts[item.list_id] = (counts[item.list_id] ?? 0) + 1;
    }
    return counts;
  }, [listItems]);

  const uncategorizedCount = useMemo(() => {
    if (!data) return 0;
    const allAssignedGameIds = new Set(listItems.map((item) => item.game_id));
    return data.filter((game) => !allAssignedGameIds.has(game.id)).length;
  }, [data, listItems]);


  const filteredGames = useMemo(() => {
    if (!data) return [];
    if (!selectedListId) return data;

    if (selectedListId === "uncategorized") {
      const allAssignedGameIds = new Set(listItems.map((item) => item.game_id));
      return data.filter((game) => !allAssignedGameIds.has(game.id));
    }

    const gameIdsInList = new Set(
      listItems
        .filter((item) => item.list_id === selectedListId)
        .map((item) => item.game_id),
    );

    return data.filter((game) => gameIdsInList.has(game.id));
  }, [data, selectedListId, listItems]);

  const handleConfirmMoveToBacklog = () => {
    if (gameIdToDelete) {
      deleteBacklog(gameIdToDelete, {
        onSuccess: () => showToast(`Jogo removido da lista.`, "success"),
        onError: (err: unknown) =>
          showToast(
            err instanceof Error
              ? err.message
              : `Erro ao remover o jogo da lista`,
            "error",
          ),
      });
      setIsConfirming(false);
      setGameIdToDelete(null);
    }
  };

  const gameActions = useMemo(
    () => [
      {
        icon: () => <SportsEsportsIcon data-testid="SportsEsportsIcon" />,
        label: (): string => "Jogar",
        gameStatus: (): string => "",
        onClick: (game: IGames) =>
          moveToPlaying(game.id, {
            onSuccess: () => showToast(`Jogo movido para Jogando!`, "success"),
            onError: (err: unknown) =>
              showToast(
                err instanceof Error
                  ? err.message
                  : `Erro ao mover "${game.name}" para Jogando`,
                "error",
              ),
          }),
        isLoadingAction: (game: IGames) => isMoving && movingId === game.id,
      },
      {
        icon: () => <BookmarkRemoveIcon data-testid="BookmarkRemoveIcon" />,
        label: (): string => "Remover",
        onClick: (game: IGames) => {
          setGameIdToDelete(game.id);
          setIsConfirming(true);
        },
        gameStatus: (): string => "",
        colorClass: () => "border-red-500/20 text-red-400 bg-red-600/[0.05]",
        isLoadingAction: (game: IGames) => isDeleting && deletingId === game.id,
      },
    ],
    [moveToPlaying, showToast, isMoving, movingId, isDeleting, deletingId],
  );

  if (isError) {
    return (
      <p style={{ color: "red" }}>
        {error instanceof Error ? error.message : "Erro ao carregar backlog"}
      </p>
    );
  }

  const isEmpty =
    isSuccess && !isFetching && !isPending && (data?.length ?? 0) === 0;

  return (
    <div className="text-white">
      {isEmpty ? (
        <EmptyState type="backlog" />
      ) : (
        <>

          <FreeGameCard />
          <div className="block md:hidden">
            <BacklogListsSidebar
              lists={lists}
              selectedListId={selectedListId}
              onSelectList={handleSelectList}
              gameCountByList={gameCountByList}
              totalCount={data?.length || 0}
              uncategorizedCount={uncategorizedCount}
            />
          </div>
          <div className="flex">
            <div className="hidden md:block">
              <BacklogListsSidebar
                lists={lists}
                selectedListId={selectedListId}
                onSelectList={handleSelectList}
                gameCountByList={gameCountByList}
                totalCount={data?.length || 0}
                uncategorizedCount={uncategorizedCount}
              />
            </div>

            <div className="flex-1 min-w-0">
              <GameGrid
                items={filteredGames}
                actions={gameActions}
                isLoading={isPending}
                onListAssign={(game) => setAssignGame(game)}
              />
            </div>
          </div>

          <ConfirmationModal
            isOpen={isConfirming}
            onClose={() => {
              setIsConfirming(false);
              setGameIdToDelete(null);
            }}
            onConfirm={handleConfirmMoveToBacklog}
            title="Atenção: Ação Irreversível"
            message="Você está prestes a remover o jogo dessa lista."
            confirmLabel="Sim, remover"
            cancelLabel="Cancelar"
            variant="danger"
            isLoading={isDeleting}
          />

          {assignGame && (
            <ListAssignModal
              game={assignGame}
              lists={lists}
              listItems={listItems}
              onClose={() => setAssignGame(null)}
            />
          )}
        </>
      )}
      <Toast
        open={open}
        message={message}
        severity={severity}
        onClose={hideToast}
      />
    </div>
  );
};

