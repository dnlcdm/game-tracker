import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { useDataGame } from "../hooks/useDataGames";

const DEBOUNCE_DELAY = 500;

export const GamesFilters: FC = () => {
  const { setParams } = useDataGame();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setParams((p) => ({ ...p, search: inputValue, limit: "50" }));
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setParams]);

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon
          className="text-gray-500 group-focus-within:text-blue-400 transition-colors duration-200"
          sx={{ fontSize: 18 }}
        />
      </div>

      <input
        type="text"
        placeholder="Search for games"
        onChange={handleInputChange}
        className="
          w-full bg-[#111827]/50 border border-gray-800 text-sm text-gray-200 
          rounded-md pl-10 pr-4 py-2 
          placeholder:text-gray-600
          focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/50
          transition-all duration-200
        "
      />
    </div>
  );
};
