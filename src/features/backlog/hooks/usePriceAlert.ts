import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase-client.service";
import { useUserAuth } from "../../auth/hooks/useUserAuth";

export const usePriceAlert = (gameId: number | string, storeId: string | null) => {
  const { session } = useUserAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const queryKey = ["price-alert", gameId];

  const { data: isActive = false, isPending } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId || !storeId) return false;
      
      const { data, error } = await supabase
        .from("game_price_alerts")
        .select("is_active")
        .eq("user_id", userId)
        .eq("game_id", String(gameId))
        .maybeSingle();

      if (error) {
        console.error("Error fetching price alert:", error);
        return false;
      }
      return data?.is_active ?? false;
    },
    enabled: !!userId && !!storeId,
  });

  const toggleMutation = useMutation({
    mutationFn: async (activeTarget: boolean) => {
      if (!userId || !storeId) throw new Error("Missing params");

      const { error } = await supabase
        .from("game_price_alerts")
        .upsert({
          user_id: userId,
          game_id: String(gameId),
          store_id: storeId,
          is_active: activeTarget,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,game_id'
        });

      if (error) throw error;
      return activeTarget;
    },
    onMutate: async (newIsActive) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<boolean>(queryKey);
      queryClient.setQueryData<boolean>(queryKey, newIsActive);
      return { previousState };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousState !== undefined) {
        queryClient.setQueryData<boolean>(queryKey, context.previousState);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isActive,
    isPending: isPending || toggleMutation.isPending,
    toggleAlert: () => toggleMutation.mutate(!isActive),
  };
};
