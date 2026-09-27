import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase-client.service";
import type { PsnIdResult } from "../details/pricing/psn.utils";

export type PsnGameData = {
    id: string;
    type: "product" | "concept";
    psn_prices_history: {
        base_price_numeric: number | null;
        discounted_price_numeric: number | null;
        is_free: boolean;
        scraped_at: string;
        discount_text: string | null;
        upsell_text: string | null;
    }[];
};

const fetchGamePricing = async (target: NonNullable<PsnIdResult>): Promise<PsnGameData | null> => {
  const { data, error } = await supabase
    .from("psn_prices_history")
    .select("*")
    .eq("game_id", target.id);


  if (error || !data || data.length === 0) return null; 

  return {
    id: target.id,
    type: target.type,
    psn_prices_history: data
  };
};

export function useFetchGamePricing(target?: PsnIdResult | null) {
  return useQuery({
    queryKey: ["game-pricing", target?.id, target?.type],
    queryFn: () => target ? fetchGamePricing(target) : null,
    enabled: !!target,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
  });
}
