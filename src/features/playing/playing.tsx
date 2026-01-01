import { useMemo, useState } from "react";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { GameGrid } from "../../components/game-grid/game-grid";
import type { IGamesSupabase } from "../search-games/types/games.types";
import { FinishGameModal } from "./components/form-complete-game/form-complete-game";
import { useFetchPlayingGames } from "./hooks/useFetchPlayingGames";
import { useUpdatePlayingGame } from "./hooks/useUpdatePlayingGame";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import { ConfirmationModal } from "../../components/confirmation.modal/confirmation-modal";
import { EmptyState } from "../../components/empty-states/empty-states";

export const Playing = () => {
  const { data, isPending, error } = useFetchPlayingGames();
  const [selectedGameToFinish, setSelectedGameToFinish] =
    useState<IGamesSupabase | null>(null);
  const [isConfirmingBacklog, setIsConfirmingBacklog] = useState(false);
  const [gameIdToMove, setGameIdToMove] = useState<number | null>(null);

  const {
    mutate: moveToBacklog,
    isPending: isUpdatingStatus,
    variables: updatingGameId,
  } = useUpdatePlayingGame("backlog");

  const handleConfirmMoveToBacklog = () => {
    if (gameIdToMove) {
      moveToBacklog(gameIdToMove);
      setIsConfirmingBacklog(false);
      setGameIdToMove(null);
    }
  };

  const gameActions = useMemo(
    () => [
      {
        label: (): string => "Concluir Jogo",
        gameStatus: (): string => "",
        icon: () => <SportsScoreIcon />,
        onClick: (game: IGamesSupabase) => setSelectedGameToFinish(game),
      },
      {
        label: (): string => "Voltar para Jogarei",
        icon: () => <PauseOutlinedIcon />,
        onClick: (game: IGamesSupabase) => {
          setGameIdToMove(game.id);
          setIsConfirmingBacklog(true);
        },
        gameStatus: (): string => "",
        isLoadingAction: (game: IGamesSupabase) =>
          isUpdatingStatus && updatingGameId === game.id,
      },
    ],
    [isUpdatingStatus, updatingGameId],
  );

  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  if (data?.length === 0 && !isPending) return <EmptyState type="playing" />;

  return (
    <div className="text-white">
      <GameGrid
        items={data ?? []}
        actions={gameActions}
        isLoading={isPending}
      />

      <ConfirmationModal
        isOpen={isConfirmingBacklog}
        onClose={() => {
          setIsConfirmingBacklog(false);
          setGameIdToMove(null);
        }}
        onConfirm={handleConfirmMoveToBacklog}
        title="Mover para Jogarei?"
        message="O jogo voltará para a sua lista de espera. Deseja continuar?"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        variant="info"
        isLoading={isUpdatingStatus}
      />

      {selectedGameToFinish && (
        <FinishGameModal
          game={selectedGameToFinish}
          isOpen={!!selectedGameToFinish}
          onClose={() => setSelectedGameToFinish(null)}
        />
      )}
    </div>
  );
};
