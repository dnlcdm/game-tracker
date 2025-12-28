import { useMemo, useState } from "react";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { GameGrid } from "../../components/game-grid/game-grid";
import type { IGames } from "../search-games/types/games.types";
import { FinishGameModal } from "./components/form-complete-game/form-complete-game";
import { useFetchPlayingGames } from "./hooks/useFetchPlayingGames";
import { useUpdatePlayingGame } from "./hooks/useUpdatePlayingGame";
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';

export const Playing = () => {
  const { data, isPending, error } = useFetchPlayingGames();
  const [selectedGameToFinish, setSelectedGameToFinish] =
    useState<IGames | null>(null);

  const {
    mutate: moveToBacklog,
    isPending: isUpdatingStatus,
    variables: updatingGameId,
  } = useUpdatePlayingGame("backlog");

  const gameActions = useMemo(
    () => [
      {
        label: (): string => "Concluir Jogo",
        gameStatus: (): string => "",
        icon: () => <SportsScoreIcon />,
        onClick: (game: IGames) => setSelectedGameToFinish(game),
      },
      {
        label: (): string => "Voltar para lista Jogarei",
        icon: () => <PauseOutlinedIcon />,
        onClick: (game: IGames) => moveToBacklog(game.id),
        gameStatus: (): string => "",
        isLoadingAction: (game: IGames) =>
          isUpdatingStatus && updatingGameId === game.id,
      },
    ],
    [isUpdatingStatus, moveToBacklog, updatingGameId]
  );

  if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>;
  }

  return (
    <div className="text-white">
      <GameGrid
        items={data ?? []}
        actions={gameActions}
        isLoading={isPending}
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
