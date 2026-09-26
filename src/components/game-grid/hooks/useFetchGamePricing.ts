import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase-client.service";

export type PsnGameData = {
    id: string;
    psn_concept_id: string;
    psn_product_id: string | null;
    name: string;
    base_price: number | null;
    discounted_price: number | null;
    is_free: boolean;
    discount_badge: string | null;
    upsell_text: string | null;
    psn_prices?: {
        base_price: number | null;
        discounted_price: number | null;
        is_free: boolean;
        snapshot_timestamp: string;
    }[];
};

const fetchGamePricing = async (psnConceptId: string): Promise<PsnGameData | null> => {
  const { data, error } = await supabase
    .from("psn_games")
    .select("*, psn_prices(*)")
    .or(`psn_concept_id.eq.${psnConceptId},psn_product_id.eq.${psnConceptId}`)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
};

export function useFetchGamePricing(psnConceptId?: string | null) {
  return useQuery({
    queryKey: ["game-pricing", psnConceptId],
    queryFn: () => psnConceptId ? fetchGamePricing(psnConceptId) : null,
    enabled: !!psnConceptId,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
  });
}
