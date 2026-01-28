import { useMemo, useState } from "react";
import { GameGrid } from "../../components/game-grid/grid/game-grid";
import { useUpdatePlayingGame } from "../playing/hooks/useUpdatePlayingGame";
import type { IGames } from "../search-games/types/games.types";
import { useDeleteBacklogGame } from "./hooks/useDeleteBacklogGame";
import { useFetchBacklogGames } from "./hooks/useFetchBacklogGames";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { FreeGameCard } from "../../components/free-game-card/free-game-card";
import { EmptyState } from "../../components/empty-states/empty-states";
import { Toast } from "../../components/snackbar/toast";
import { useToast } from "../../components/snackbar/hooks/useToast";
import { ConfirmationModal } from "../../components/confirmation-modal/confirmation-modal";

export const Backlog = () => {
  const { data, isPending, isError, isSuccess, isFetching, error } =
    useFetchBacklogGames();

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
        icon: () => <SportsEsportsIcon />,
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
        icon: () => <BookmarkRemoveIcon />,
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

          <GameGrid
            items={data ?? []}
            actions={gameActions}
            isLoading={isPending}
          />

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
