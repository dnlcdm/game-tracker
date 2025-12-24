import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../../../services/supabase-client.service";
import type { IGames } from "../../types/games.types";

export const addToBacklog = async (
  gameData: IGames,
  session: Session | null,
) => {
  if (!session) return;

  const backlogData = {
    ...gameData,
    user_id: session.user.id,
  };

  const { error: upsertError } = await supabase
    .from("games_backlog")
    .upsert([backlogData], { onConflict: "id,user_id" });

  if (upsertError) {
    throw new Error("Erro ao salvar metadados do jogo: " + upsertError.message);
  }

  return { success: true, gameName: gameData.name };
};
