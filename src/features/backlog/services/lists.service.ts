import { supabase } from "../../../services/supabase-client.service";
import type { IGameList, IGameListItem } from "../types/list.types";

export const fetchUserLists = async (): Promise<IGameList[]> => {
  const { data, error } = await supabase
    .from("game_lists")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message || "Falha ao buscar listas.");
  return data;
};

export const createList = async (name: string): Promise<IGameList> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data: existing } = await supabase
    .from("game_lists")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("game_lists")
    .insert({ name, user_id: user.id, sort_order: nextOrder })
    .select()
    .single();

  if (error) throw new Error(error.message || "Falha ao criar lista.");
  return data;
};

export const deleteList = async (listId: string): Promise<void> => {
  const { error } = await supabase.from("game_lists").delete().eq("id", listId);
  if (error) throw new Error(error.message || "Falha ao excluir lista.");
};

export const renameList = async (listId: string, name: string): Promise<void> => {
  const { error } = await supabase
    .from("game_lists")
    .update({ name })
    .eq("id", listId);
  if (error) throw new Error(error.message || "Falha ao renomear lista.");
};

export const reorderLists = async (orderedIds: string[]): Promise<void> => {
  const updates = orderedIds.map((id, index) => ({ id, sort_order: index }));

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from("game_lists")
      .update({ sort_order })
      .eq("id", id);
    if (error) throw new Error(error.message || "Falha ao reordenar listas.");
  }
};

export const fetchListItems = async (): Promise<IGameListItem[]> => {
  const { data, error } = await supabase.from("game_list_items").select("*");
  if (error) throw new Error(error.message || "Falha ao buscar itens de listas.");
  return data;
};

export const toggleGameInList = async (
  listId: string,
  gameId: number,
): Promise<{ added: boolean }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data: existing } = await supabase
    .from("game_list_items")
    .select("list_id")
    .eq("list_id", listId)
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("game_list_items")
      .delete()
      .eq("list_id", listId)
      .eq("game_id", gameId)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return { added: false };
  }

  const { error } = await supabase
    .from("game_list_items")
    .insert({ list_id: listId, game_id: gameId, user_id: user.id });
  if (error) throw new Error(error.message);
  return { added: true };
};
