import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase-client.service.ts";
import { type Session } from "@supabase/supabase-js";

export type SignUpStatus = "SIGNED_IN" | "CONFIRM_EMAIL";

export interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<SignUpStatus>;
  signOut: () => Promise<void>;
}

export const useUserAuth = (): AuthContextType => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) throw error;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<SignUpStatus> => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName?.trim() || null,
        },
      },
    });

    setIsLoading(false);
    if (error) throw error;

    return data.session ? "SIGNED_IN" : "CONFIRM_EMAIL";
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

   const signInWithGoogle = async () => {
     setIsLoading(true);
     try {
       const { error } = await supabase.auth.signInWithOAuth({
         provider: "google",
       });
       if (error) throw error;
     } catch (error) {
       setIsLoading(false);
       throw error;
     }
   };

  const ACCESS_TOKEN_KEY = "access_token";

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore errors on signOut (e.g. already expired session)
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("sb-") || key.startsWith("@supabase")) {
        localStorage.removeItem(key);
      }
    }
    window.location.href = "/login";
  };

  return {
    session,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
};
