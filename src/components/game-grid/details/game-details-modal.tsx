import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import type { IGameAction } from "../types";
import { useHltb } from "../hooks/useFetchGameTimeToBeat";
import { GameDetailsCover } from "./components/game-details-cover";
import { GameDetailsActions } from "./components/game-details-actions";
import { GameDetailsTimeSection } from "./components/game-details-time-section";
import { GameDetailsPlatforms } from "./components/game-details-platforms";
import { GameDetailsMediaGrid } from "./components/game-details-video";

interface Props {
  game: IGamesSupabase;
  onClose: () => void;
  actions: IGameAction[];
}

export const GameDetailsModal = ({ game, actions, onClose }: Props) => {
  const { isPending, data } = useHltb(game.name);
  if (!isPending) {
    console.log(data);
  }

  const hltb = data?.[0];
  const times = hltb?.times;

  const rows = [
    {
      label: "História Principal",
      time: times?.main_history?.text,
      colorClass: "bg-blue-500",
      icon: SportsEsportsIcon,
    },
    {
      label: "Principal + Extras",
      time: times?.main_plus_extra?.text,
      colorClass: "bg-orange-500",
      icon: TrendingUpIcon,
    },
    {
      label: "100% Completo",
      time: times?.completionist?.text,
      colorClass: "bg-red-500",
      icon: EmojiEventsIcon,
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl hidden md:block"
        onClick={onClose}
      />

      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:max-h-[85vh] bg-gray-950 md:border md:border-white/10 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in md:zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-black/50 text-white/90 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
        >
          <CloseIcon fontSize="medium" />
        </button>

        <GameDetailsCover game={game} />

        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <GameDetailsMediaGrid
            trailers={game.trailers}
            screenshots={game.screenshots}
          />
          <GameDetailsTimeSection rows={rows} isLoading={isPending} />
          <GameDetailsActions actions={actions} game={game} onClose={onClose} />

          <GameDetailsPlatforms platforms={game.platforms} />
        </div>
      </div>
    </div>
  );
};
