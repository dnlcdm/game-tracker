import { GameGrid } from "../../components/game-grid/game-grid";
import type { IGames } from "../search-games/types/games.types";
import { useUpdatePlayingGame } from "./hooks/useUpdatePlayingGame";
import { useFetchPlayingGames } from "./hooks/useFetchPlayingGames";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

export const Playing = () => {
  const { data, isPending, isError } = useFetchPlayingGames();

  const {
    mutate: mutatePlaying,
    isPending: isPendingPlaying,
    variables: variablesPlaying,
  } = useUpdatePlayingGame(false);

  if (isError) {
    return <p style={{ color: "red" }}>{isError}</p>;
  }

  const gameActions = [
    {
      icon: <SportsEsportsIcon fontSize="small" />,
      label: "Jogar",
      onClick: (game: IGames) => mutatePlaying(game.id),
      isLoadingAction: (game: IGames) =>
        isPendingPlaying && variablesPlaying === game.id,
    },
  ];

  return (
    <div className="p-4 text-white">
      <GameGrid
        items={data ?? []}
        actions={gameActions}
        isLoading={isPending}
      />
    </div>
  );
};
