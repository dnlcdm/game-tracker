import { useState } from "react";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import type { IGameAction } from "../types";
import { useHltb } from "../hooks/useFetchGameTimeToBeat";
import { GameDetailsCover } from "./game-details-cover";
import { GameDetailsActions } from "./game-details-actions";
import { GameDetailsTimeSection } from "./game-details-time-section";
import { GameDetailsPlatforms } from "./game-details-platforms";
import { GameDetailsMediaGrid } from "./game-details-video";
import { GameDetailsDescription } from "./game-details-description";

interface Props {
  game: IGamesSupabase;
  onClose: () => void;
  actions: IGameAction[];
}

const TABS = ["Mídia", "Tempo", "Descrição"] as const;
type Tab = (typeof TABS)[number];

export const GameDetailsModal = ({ game, actions, onClose }: Props) => {
  const { isPending, data } = useHltb(game.name);
  const [activeTab, setActiveTab] = useState<Tab>("Mídia");

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl hidden md:block"
        onClick={onClose}
      />

      <div className="relative w-full h-full md:h-[85vh] md:max-w-7xl bg-gray-950 md:border md:border-white/10 md:rounded-2xl shadow-2xl overflow-hidden grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[0.45fr_0.55fr] animate-in md:zoom-in-95 duration-300">
        <button
          className="absolute z-10 top-4 right-4 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 p-1 rounded-full transition-colors"
          onClick={onClose}
        >
          <CloseIcon data-testid="CloseIcon" fontSize="small" />
        </button>

        <GameDetailsCover game={game} />

        <div className="min-h-0 w-full flex flex-col overflow-hidden md:border-l md:border-white/10">
          <div className="flex-none bg-gray-950/80 backdrop-blur-sm border-b border-white/10">
            <div className="flex px-6 md:px-10 pt-1 gap-1">
              {TABS.map((tab) => {
                const isDisabled =
                  (tab === "Descrição" && !game.review) ||
                  (tab === "Tempo" && !isPending && !data?.length);

                return (
                  <button
                    key={tab}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setActiveTab(tab)}
                    className={`relative px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${isDisabled
                        ? "text-gray-600 opacity-50 cursor-not-allowed"
                        : activeTab === tab
                          ? "text-blue-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    title={isDisabled ? `Sem dados para ${tab}` : ""}
                  >
                    {tab}
                    {activeTab === tab && !isDisabled && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col gap-6 md:gap-8">
            {activeTab === "Mídia" && (
              <GameDetailsMediaGrid
                trailers={game.trailers}
                screenshots={game.screenshots}
              />
            )}

            {activeTab === "Tempo" && (
              <GameDetailsTimeSection rows={rows} isLoading={isPending} />
            )}

            {activeTab === "Descrição" && (
              <GameDetailsDescription gameDescription={game.review} />
            )}
          </div>
          <div className="px-6 md:px-10 py-4">
            <GameDetailsPlatforms platforms={game.platforms} />
          </div>
          <div className="flex-none bg-gray-950/90 backdrop-blur-sm border-t border-white/10 px-6 md:px-10 py-3">
            <GameDetailsActions actions={actions} game={game} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
