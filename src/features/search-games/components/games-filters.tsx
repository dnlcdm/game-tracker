import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { useDataGame } from "../hooks/useDataGames";

const DEBOUNCE_DELAY = 500;

export const GamesFilters: FC = () => {
  const { setParams, isPending, observerTarget } = useDataGame();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
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
        if (entries[0].isIntersecting && !isPending) {
          setParams((p) => ({
            ...p,
            page: String(Number(p.page || "1") + 1),
          }));
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget?.current) {
      observer.observe(observerTarget?.current);
    }

    return () => observer.disconnect();
  }, [isPending, observerTarget, setParams]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Input de Busca permanece no topo */}
      <div className="relative w-full max-w-md group mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon
            className="text-gray-500 group-focus-within:text-blue-400"
            sx={{ fontSize: 18 }}
          />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for games..."
          className="w-full bg-[#111827]/50 border border-gray-800 text-sm text-gray-200 rounded-md pl-10 pr-4 py-2 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none"
        />
      </div>
    </div>
  );
};
