import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase-client.service";

export const useFetchCachedTranslation = (gameId?: number) => {
  return useQuery({
    queryKey: ["game_translation", gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const { data, error } = await supabase
        .from("game_translations")
        .select("translated_text")
        .eq("game_id", gameId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching translation cache:", error);
      }

      return data?.translated_text || null;
    },
    enabled: !!gameId,
    staleTime: Infinity,
  });
};
