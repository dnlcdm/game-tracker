import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { IGames } from "../types/games.types";

type ContextType = {
  results: IGames[];
  isPending: boolean;
  params: Record<string, string>;
  setParams: Dispatch<SetStateAction<Record<string, string>>>;
  observerTarget: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
};

export const DataGameContext = createContext<ContextType | undefined>(
  undefined,
);
