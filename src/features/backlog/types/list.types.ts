export interface IGameList {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface IGameListItem {
  list_id: string;
  game_id: number;
  user_id: string;
  added_at: string;
}
