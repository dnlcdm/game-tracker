import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { countSelectedFilters } from "../../../components/filters/filter-state.utils";
import { FILTER_GROUPS } from "./sidebar-filters/filter-definitions";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type Dispatch,
  type FC,
  type SetStateAction,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useDataGame } from "../hooks/useDataGames";
import { useInfinitePagination, type GameParams } from "./hooks/useInfinitePagination";

const DEBOUNCE_DELAY_MS = 500;
const FIRST_PAGE = "1";

const useDebouncedSearch = (
  value: string,
  setParams: Dispatch<SetStateAction<GameParams>>,
) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParams((prev) => {
        if (prev.search !== value) {
          setTimeout(() => {
            const mainContainer = document.querySelector("main");
            if (mainContainer) {
              mainContainer.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }, 50);
        }
        return {
          ...prev,
          search: value,
          page: FIRST_PAGE,
        };
      });
    }, DEBOUNCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [value, setParams]);
};

export const GamesFilters: FC = () => {
  const { params, setParams, isPending, observerTarget, hasMore, setIsMobileFilterOpen } = useDataGame();
  const [inputValue, setInputValue] = useState("");

  useDebouncedSearch(inputValue, setParams);
  useInfinitePagination({ observerTarget, isPending, hasMore, setParams });

  const activeCount = useMemo(
    () => countSelectedFilters(params, FILTER_GROUPS),
    [params]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setParams((prev) => ({ ...prev, search: "", page: FIRST_PAGE }));
  }, [setParams]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  }, []);

  return (
    <div className="sticky top-[0px] z-[40] flex flex-col gap-6 w-full md:pt-4 pb-0 md:pb-4 bg-[#030712] mx-auto">
      <div className="relative w-full group mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          {isPending && (inputValue || params.search) && params.page === FIRST_PAGE ? (
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
          className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 text-sm text-slate-200 md:rounded-lg pl-11 pr-24 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 shadow-lg"
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
          {inputValue && (
            <button
              onClick={handleClear}
              className="flex items-center text-slate-500 hover:text-white transition-colors animate-in fade-in slide-in-from-right-2 duration-200"
              aria-label="Limpar pesquisa"
            >
              <div className="flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 p-1 rounded-full transition-colors">
                <CloseIcon sx={{ fontSize: 16 }} />
              </div>
            </button>
          )}

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex cursor-pointer items-center justify-center rounded-lg bg-slate-900/80 px-2 py-1 text-slate-400 hover:text-blue-400 transition-colors hover:bg-slate-800"
            >
              <span className="relative">
                <FilterListIcon className="h-5 w-5" />
                {activeCount > 0 && (
                  <span className="absolute -bottom-1 -right-2 rounded-full bg-blue-500/20 px-1 py-[1px] text-[10px] font-bold text-blue-300 pointer-events-none">
                    {activeCount}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm pointer-events-none transition-opacity -z-10" />
      </div>
    </div>
  );
};
