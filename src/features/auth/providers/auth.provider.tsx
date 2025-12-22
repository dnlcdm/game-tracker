import { type PropsWithChildren } from "react";
import { AuthContext } from "../auth.context.ts";
import { useAuth } from "../hooks/useAuth.ts";
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isPending } = useAuth();

  return (
    <AuthContext.Provider value={{ isPending }}>
      {children}
    </AuthContext.Provider>
  );
};
