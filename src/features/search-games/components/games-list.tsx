import { useDataGame } from "../hooks/useDataGames";

import type { IGames } from "../types/games.types";
import { useAddGameToBacklog } from "../hooks/useAddGameToBacklog";
import { GameGrid } from "../../../components/game-grid/game-grid";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export const GamesList = () => {
  const { results, isPending } = useDataGame();
  const {
    mutate,
    isPending: isPendingMutate,
    variables,
  } = useAddGameToBacklog();

  const gameActions = [
    {
      icon: <BookmarkIcon fontSize="small" />,
      label: "Favoritar",
      onClick: (game: IGames) => mutate(game),
      colorClass: "hover:text-green-400",
      isLoadingAction: (game: IGames) =>
        isPendingMutate && variables?.id === game.id,
    },
  ];

  return (
    <div className="min-h-screen mt-2 mx-auto w-full left-0 py-4">
      <GameGrid items={results} actions={gameActions} isLoading={isPending} />
    </div>
  );
};
