export interface IGames {
  id: number;
  name: string;
  coverUrl: string;
  playing?: boolean;
  first_release_date: string;
  rating: number;
  platforms: {
    id: number;
    name: string;
    abbr: string;
  }[];
  websites?: {
    id: number;
    category: number;
    url: string;
  }[];
  external_games?: {
    id: number;
    category: number;
    uid: string;
    url: string;
  }[];
}

export interface IGamesSupabase extends IGames {
  user_id: string;
  rating_count: number;
  timeToBeat: Record<string, number>[];
  status: "backlog" | "playing" | "completed";
  user_rating: number;
  co_op_friend: string;
  completed_at: string;
  review: string;
  completion_type: string;
  platform_used: string;
  difficult: number;
  minutes_played: number;
  trailers: {
    name?: string | null;
    youtubeId: string;
    watchUrl?: string;
    embedUrl?: string;
  }[];
  screenshots: string[];
}

export interface IRequirements {
  minimum?: string;
  recommended?: string;
}
