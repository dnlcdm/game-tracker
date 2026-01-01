import { GameGrid } from "../../components/game-grid/game-grid";
import { useUpdatePlayingGame } from "../playing/hooks/useUpdatePlayingGame";
import type { IGames } from "../search-games/types/games.types";
import { useDeleteBacklogGame } from "./hooks/useDeleteBacklogGame";
import { useFetchBacklogGames } from "./hooks/useFetchBacklogGames";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { FreeGameCard } from "../../components/free-game-card/free-game-card";
import { EmptyState } from "../../components/empty-states/empty-states";

export const Backlog = () => {
  const { data, isPending, isError } = useFetchBacklogGames();
  const {
    mutate,
    variables,
    isPending: isPendingMutation,
  } = useDeleteBacklogGame();

  const {
    mutate: mutatePlaying,
    isPending: isPendingPlaying,
    variables: variablesPlaying,
  } = useUpdatePlayingGame("playing");

  if (isError) {
    return <p style={{ color: "red" }}>{isError}</p>;
  }

  const gameActions = [
    {
      icon: () => <SportsEsportsIcon />,
      label: () => "Jogar",
      gameStatus: (): string => "",
      onClick: (game: IGames) => mutatePlaying(game.id),
      isLoadingAction: (game: IGames) =>
        isPendingPlaying && variablesPlaying === game.id,
    },
    {
      icon: () => <BookmarkRemoveIcon />,
      label: () => "Remover",
      onClick: (game: IGames) => mutate(game.id),
      gameStatus: (): string => "",
      colorClass: () => "hover:text-pink-500",
      isLoadingAction: (game: IGames) =>
        isPendingMutation && variables === game.id,
    },
  ];

  if (data?.length === 0 && !isPending) return <EmptyState type="backlog" />;

  return (
    <div className="text-white">
      <FreeGameCard />
      <GameGrid
        items={data ?? []}
        actions={gameActions}
        isLoading={isPending}
      />
    </div>
  );
};
