import { GameGrid } from "../../components/game-grid/game-grid";
import type { IGames } from "../search-games/types/games.types";
import { useFetchPlayingGames } from "./hooks/useFetchPlayingGames";
import CheckCircleIcon from "@mui/icons-material/SportsEsports";
import PauseIcon from "@mui/icons-material/Pause";
import BlockIcon from "@mui/icons-material/Block";
import { useMemo } from "react";

export const Playing = () => {
  const { data, isPending, isError } = useFetchPlayingGames();

  /*
*
  const {
    mutate: mutatePlaying,
    isPending: isPendingPlaying,
    variables: variablesPlaying,
  } = useUpdatePlayingGame(false);
  const gameActions = [
    {
      icon: () => <SportsEsportsIcon fontSize="small" />,
      label: () => "Remover da lista",
      onClick: (game: IGames) => mutatePlaying(game.id),
      isLoadingAction: (game: IGames) =>
        isPendingPlaying && variablesPlaying === game.id,
    },
  ];
*/

  const gameActions = useMemo(
    () => [
      {
        label: () => "Concluir Jogo",
        icon: () => <CheckCircleIcon className="text-green-500" />,
        onClick: (game: IGames) => console.log(game, "completed"),
      },
      {
        label: () => "Pausar",
        icon: () => <PauseIcon className="text-yellow-500" />,
        onClick: (game: IGames) => console.log(game, "on-hold"),
      },
      {
        label: () => "Abandonar",
        icon: () => <BlockIcon className="text-red-500" />,
        onClick: (game: IGames) => console.log(game, "dropped"),
      },
    ],
    [],
  );

  if (isError) {
    return <p style={{ color: "red" }}>{isError}</p>;
  }

  return (
    <div className="text-white">
      <GameGrid
        items={data ?? []}
        actions={gameActions}
        isLoading={isPending}
      />
    </div>
  );
};
