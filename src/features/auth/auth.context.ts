import { createContext } from "react";

type ContextType = {
  isPending: boolean;
};
export const AuthContext = createContext<ContextType>({
  isPending: false,
});
