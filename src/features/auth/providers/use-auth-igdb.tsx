import { type PropsWithChildren } from "react";

import { createContext } from "react";
import { useAuthIGDB } from "../hooks/useAuthIGDB";

type ContextType = {
  isPending: boolean;
};

const AuthContext = createContext<ContextType>({
  isPending: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isPending } = useAuthIGDB();

  return (
    <AuthContext.Provider value={{ isPending }}>
      {children}
    </AuthContext.Provider>
  );
};