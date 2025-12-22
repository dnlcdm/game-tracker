import { supabase } from "../../../services/supabase-client.service";

export const updateGameFromPlaying = async (
  gameId: number,
  value?: boolean,
): Promise<void> => {
  const { error } = await supabase
    .from("games_backlog")
    .update({ playing: value })
    .eq("id", gameId);

  if (error) {
    throw new Error(error.message || "Erro ao atualizar o status do jogo.");
  }
};
