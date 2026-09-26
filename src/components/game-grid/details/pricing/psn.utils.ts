import type { IGamesSupabase } from "../../../../features/search-games/types/games.types";

export function extractPsnId(game: IGamesSupabase): string | null {
    const psnStoreSite = game.websites?.find((w) => w.url?.includes("store.playstation.com"));

    let psnConceptId = null;
    if (psnStoreSite?.url) {
        const cleanUrl = psnStoreSite.url.replace(/\/+$/, "");
        psnConceptId = cleanUrl.split("/").pop();
    }

    const psnExternalId = (!psnConceptId && game.external_games)
        ? game.external_games.find((e) => e.uid?.match(/^100\d{5}$/))?.uid
        : null;

    return psnConceptId || psnExternalId || null;
}
