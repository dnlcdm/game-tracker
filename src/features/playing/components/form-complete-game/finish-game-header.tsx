import CloseIcon from "@mui/icons-material/Close";
import type { IGames } from "../../../search-games/types/games.types";

interface FinishGameHeaderProps {
  game: IGames;
  onClose: () => void;
}

export const FinishGameHeader = ({ game, onClose }: FinishGameHeaderProps) => (
  <div className="relative h-32 w-full">
    <img
      src={game.coverUrl}
      className="w-full h-full object-cover opacity-30 blur-xs"
      alt={`Capa de ${game.name}`}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
    <button
      type="button"
      onClick={onClose}
      className="absolute top-2 right-2 p-1 cursor-pointer bg-black/40 hover:bg-black/60 rounded-lg text-white transition-colors"
      aria-label="Fechar modal"
    >
      <CloseIcon />
    </button>
    <div className="absolute bottom-4 left-6">
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">
        {game.name}
      </h2>
    </div>
  </div>
);
