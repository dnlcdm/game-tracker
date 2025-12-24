import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { DataGameContext } from "../context/data-game-context";
import { useFetchGameData } from "../hooks/useFetchGameData";
import type { IGames } from "../types/games.types";

const LIMIT = 28;
const INITIAL_PARAMS: Record<string, string> = {
  limit: String(LIMIT),
  page: "1",
  search: "",
};

export const DataGameProvider = ({ children }: PropsWithChildren) => {
  const [params, setParams] = useState(INITIAL_PARAMS);
  const { data, isPending } = useFetchGameData(params);
  const [results, setResults] = useState<IGames[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (data?.results) {
      const newItems = data.results;

      if (params.page === "1") {
        setResults(newItems);
        setHasMore(newItems.length >= LIMIT);
      } else {
        setResults((prev) => [...prev, ...newItems]);

        if (newItems.length < LIMIT) {
          setHasMore(false);
        }
      }
    }
  }, [data, params.page]);
  return (
    <DataGameContext.Provider
      value={{
        results,
        isPending,
        setParams,
        params,
        observerTarget,
        hasMore,
      }}
    >
      {children}
    </DataGameContext.Provider>
  );
};
