import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";

export type PsnIdResult = {
    id: string;
    type: "product" | "concept";
} | null;

export function extractPsnId(game: IGamesSupabase): PsnIdResult {
    const psnStoreSite = game.websites?.find((w) => w.url?.includes("store.playstation.com"));

    if (psnStoreSite?.url) {
        const cleanUrl = psnStoreSite.url.replace(/\/+$/, "");
        const id = cleanUrl.split("/").pop();
        if (id) {
            const type = cleanUrl.includes("/product/") ? "product" : "concept";
            return { id, type };
        }
    }

    const psnExternalId = game.external_games?.find((e) => e.uid?.match(/^100\d{5}$/))?.uid;
    if (psnExternalId) {
        return { id: psnExternalId, type: "concept" }; // Supabase UID fallbacks are concept IDs
    }

    return null;
}
