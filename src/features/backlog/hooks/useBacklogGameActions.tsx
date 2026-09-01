import { useMemo } from "react";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useUpdatePlayingGame } from "../../playing/hooks/useUpdatePlayingGame";
import { useDeleteBacklogGame } from "./useDeleteBacklogGame";
import type { IGames } from "../../search-games/types/games.types";
import type { IGameAction } from "../../../components/game-grid/types";

interface UseBacklogGameActionsParams {
    showToast: (message: string, severity: "success" | "error") => void;
    onRequestDelete: (gameId: number) => void;
}

export const useBacklogGameActions = ({
    showToast,
    onRequestDelete,
}: UseBacklogGameActionsParams) => {
    const {
        mutate: moveToPlaying,
        isPending: isMoving,
        variables: movingId,
    } = useUpdatePlayingGame("playing");

    const {
        mutate: deleteBacklog,
        variables: deletingId,
        isPending: isDeleting,
    } = useDeleteBacklogGame();

    const gameActions = useMemo<IGameAction[]>(
        () => [
            {
                icon: () => <SportsEsportsIcon data-testid="SportsEsportsIcon" />,
                label: (): string => "Jogar",
                gameStatus: (): string => "",
                onClick: (game: IGames) =>
                    moveToPlaying(game.id, {
                        onSuccess: () => showToast("Jogo movido para Jogando!", "success"),
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
                onClick: (game: IGames) => onRequestDelete(game.id),
                gameStatus: (): string => "",
                colorClass: () => "border-red-500/20 text-red-400 bg-red-600/[0.05]",
                isLoadingAction: (game: IGames) => isDeleting && deletingId === game.id,
            },
        ],
        [moveToPlaying, showToast, isMoving, movingId, isDeleting, deletingId, onRequestDelete],
    );

    const confirmDelete = (gameId: number) => {
        deleteBacklog(gameId, {
            onSuccess: () => showToast("Jogo removido da lista.", "success"),
            onError: (err: unknown) =>
                showToast(
                    err instanceof Error
                        ? err.message
                        : "Erro ao remover o jogo da lista",
                    "error",
                ),
        });
    };

    return { gameActions, isDeleting, confirmDelete };
};
