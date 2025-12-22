import { useContext } from "react";
import { DataGameContext } from "../context/data-game-context";

export const useDataGame = () => {
  const context = useContext(DataGameContext);

  if (!context) {
    throw new Error("useDataGame must be used within DataGameProvider");
  }

  return context;
};
