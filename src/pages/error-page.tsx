import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import BugReportIcon from "@mui/icons-material/BugReport";
import { PATHS } from "../router/routes";

export const ErrorPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any; 
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  
  const isNetworkError = error?.message?.includes("fetch") || error?.status === 503;

  return (
    <div className="min-h-screen bg-[#070A10] flex flex-col items-center justify-center p-6 text-center">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[120px] rounded-full transition-colors duration-700 ${
        is404 ? "bg-blue-600/10" : "bg-red-600/10"
      }`} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8 group">
          <div className={`absolute inset-0 animate-pulse blur-xl opacity-20 ${is404 ? "bg-blue-500" : "bg-red-500"}`} />
          <WarningAmberIcon 
            className={`relative text-7xl transition-transform duration-500 group-hover:scale-110 ${
              is404 ? "text-blue-500" : "text-red-500"
            }`} 
          />
        </div>

        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">
          {is404 ? "Status: 404 Not Found" : `Critical Error: ${error?.status || "Unknown"}`}
        </span>

        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">
          {is404 ? "Link Quebrado" : "Falha no Sistema"}
        </h1>
        
        <p className="text-gray-400 max-w-sm mb-10 text-sm font-medium leading-relaxed">
          {is404 
            ? "O jogo que você procura foi removido da biblioteca ou a URL está incorreta." 
            : isNetworkError 
            ? "Não foi possível conectar aos servidores do Supabase. Verifique sua internet." 
            : "Ocorreu uma falha inesperada na execução do código do sistema."}
        </p>

        {error?.message && !is404 && (
          <div className="mb-8 w-full max-w-xs bg-black/40 border border-white/5 rounded-lg p-3 text-left">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase mb-1">
                <BugReportIcon sx={{ fontSize: 12 }} />
                <span>Log de Erro:</span>
             </div>
             <p className="text-[10px] font-mono text-red-400/80 break-all leading-tight">
                {error.message}
             </p>
          </div>
        )}

        <div className="flex flex-col w-full max-w-xs gap-3">
          {!is404 && (
            <button
              onClick={() => window.location.assign("/login")} 
              className="flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all hover:bg-gray-200 active:scale-95"
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
              Reiniciar App
            </button>
          )}

          <button
            onClick={() => navigate(PATHS.SEARCH)}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 uppercase tracking-widest text-xs transition-all active:scale-95"
          >
            <HomeIcon sx={{ fontSize: 18 }} />
            Voltar ao Início
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[10px] text-gray-700 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} — Game Backlog Manager
      </footer>
    </div>
  );
};