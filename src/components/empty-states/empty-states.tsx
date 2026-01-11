import { useMemo } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ReplayIcon from "@mui/icons-material/Replay";

export type EmptyStateType =
  | "search"
  | "backlog"
  | "finished"
  | "playing"
  | "generic";

interface EmptyStateProps {
  type?: EmptyStateType;
  messages?: string[];
  onAction?: () => void;
  actionLabel?: string;
}

const STATE_CONFIG = {
  search: {
    icon: SearchOffIcon,
    accentColor: "text-cyan-500",
    bgGlow: "bg-cyan-500/10",
    defaultMessages: [
      "Exploramos o mapa inteiro e não achamos esse jogo.",
      "Procuramos em todos os saves… nada por aqui.",
      "Game Over! Esse jogo não apareceu por aqui.",
    ],
  },
  backlog: {
    icon: PlaylistAddIcon,
    accentColor: "text-violet-500",
    bgGlow: "bg-violet-500/10",
    defaultMessages: ["Missão principal: escolher o próximo jogo."],
  },
  finished: {
    icon: EmojiEventsIcon,
    accentColor: "text-yellow-500",
    bgGlow: "bg-yellow-500/10",
    defaultMessages: [
      "Quando você zerar um jogo, ele aparece aqui. Não precisa ter pressa, a gente espera.",
      "Seus jogos zerados aparecerão aqui… quando você finalmente terminar algum.",
      "Aqui ficam seus jogos zerados. Se estiver vazio… você sabe o motivo.",
    ],
  },
  playing: {
    icon: SportsEsportsIcon,
    accentColor: "text-emerald-500",
    bgGlow: "bg-emerald-500/10",
    defaultMessages: ["Parece que temos um CLT aqui."],
  },
  generic: {
    icon: SportsEsportsIcon,
    accentColor: "text-slate-500",
    bgGlow: "bg-slate-500/10",
    defaultMessages: ["Não há itens para exibir aqui."],
  },
};

export const EmptyState = ({
  type = "generic",
  messages,
  onAction,
  actionLabel = "Atualizar",
}: EmptyStateProps) => {
  const config = STATE_CONFIG[type];
  const IconComponent = config.icon;

  const activeMessages = messages || config.defaultMessages;

  const randomMessage = useMemo(() => {
    return activeMessages[Math.floor(Math.random() * activeMessages.length)];
  }, [activeMessages]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full animate-in fade-in zoom-in duration-700">
      <div className="relative mb-6 group cursor-default">
        <div
          className={`absolute inset-0 blur-[50px] rounded-full transition-colors duration-500 ${config.bgGlow}`}
        />

        <div className="relative bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
          <IconComponent
            sx={{ fontSize: 48 }}
            className={`${config.accentColor} opacity-90 drop-shadow-lg`}
          />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-[320px] md:max-w-[720px]">
        <h3 data-testid="empty-state-message" className="mb-2 text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
          {randomMessage}
        </h3>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-8 flex items-center gap-2 px-5 py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md transition-all active:scale-95 shadow-lg"
        >
          <ReplayIcon sx={{ fontSize: 14 }} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
