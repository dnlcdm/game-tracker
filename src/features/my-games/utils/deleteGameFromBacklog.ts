import { supabase } from "../../../services/supabase-client.service";

export const deleteGameFromBacklog = async (gameId: number): Promise<void> => {
  const { error } = await supabase
    .from("games_backlog")
    .delete()
    .eq("id", gameId);

  if (error) {
    throw new Error(
      error.message || `Falha ao deletar o jogo de ID: ${gameId}`,
    );
  }
};
