import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type FC,
} from "react";
import { useDataGame } from "../hooks/useDataGames";

const DEBOUNCE_DELAY = 500;

export const GamesFilters: FC = () => {
  const { setParams, isPending, observerTarget, hasMore } = useDataGame();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    setParams((p) => ({ ...p, search: "", page: "1" }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setParams((p) => ({ ...p, search: inputValue, page: "1" }));
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [inputValue, setParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPending && hasMore) {
          setParams((p) => ({
            ...p,
            page: String(Number(p.page || "1") + 1),
          }));
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isPending, hasMore, setParams, observerTarget]);

  return (
    <div className="flex flex-col gap-6 w-full px-2 pt-4 md:px-0">
      <div className="relative w-full max-w-xl group mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <SearchIcon
              className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
              sx={{ fontSize: 20 }}
            />
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          enterKeyHint="search"
          placeholder="Pesquise por jogos"
          className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-800 text-sm text-slate-200 rounded-lg pl-11 pr-11 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 shadow-lg"
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors animate-in fade-in slide-in-from-right-2 duration-200"
            aria-label="Limpar pesquisa"
          >
            <div className="flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 p-1 rounded-full transition-colors">
              <CloseIcon data-testid="CloseIcon" sx={{ fontSize: 16 }} />
            </div>
          </button>
        )}

        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm pointer-events-none transition-opacity -z-10" />
      </div>
    </div>
  );
};
