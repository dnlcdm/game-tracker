import { supabase } from "../../../services/supabase-client.service";

export const removeFromBacklog = async (
  gameId: number,
  userId: string | undefined,
) => {
  if (!userId) throw new Error("Usuário não autenticado");

  const { error } = await supabase
    .from("games_backlog")
    .delete()
    .eq("user_id", userId)
    .eq("id", gameId);

  if (error) throw error;
};
