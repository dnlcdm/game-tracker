import { type PropsWithChildren } from "react";
import { createContext } from "react";
import { useUserAuth, type AuthContextType } from "../hooks/useUserAuth.ts";

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const { session, isLoading, signInWithGoogle, signOut, signInWithEmail, signUpWithEmail } = useUserAuth();

  return (
    <UserAuthContext.Provider
      value={{
        session,
        isLoading,
        signInWithGoogle,
        signOut,
        signInWithEmail,
        signUpWithEmail
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
