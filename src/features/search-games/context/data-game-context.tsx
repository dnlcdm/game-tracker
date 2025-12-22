import { createContext, type Dispatch, type SetStateAction } from "react";
import type { IGames } from "../types/games.types";

type ContextType = {
  results: IGames[];
  isPending: boolean;
  params: Record<string, string>;
  setParams: Dispatch<SetStateAction<Record<string, string>>>;
};

const initialData = {
  results: [],
  isPending: true,
  params: {},
  setParams: () => {},
};

export const DataGameContext = createContext<ContextType>(initialData);
