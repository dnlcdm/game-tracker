import { useState, type PropsWithChildren } from "react";
import { DataGameContext } from "../context/data-game-context";
import { useFetchGameData } from "../hooks/useFetchGameData";

export const DataGameProvider = ({ children }: PropsWithChildren) => {
  const [params, setParams] = useState({});
  const { data, isPending } = useFetchGameData(params);
  const results = data?.results ?? [];

  return (
    <DataGameContext.Provider
      value={{
        results,
        isPending,
        setParams,
        params,
      }}
    >
      {children}
    </DataGameContext.Provider>
  );
};
