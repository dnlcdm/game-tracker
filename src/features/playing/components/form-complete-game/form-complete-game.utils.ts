import type { IGamesSupabase } from "../../../search-games/types/games.types";

export function getFinishGameDefaultValues(game: IGamesSupabase) {
  return {
    completed_at: game.completed_at ? game.completed_at.split("T")[0] : "",
    co_op_friend: game.co_op_friend ?? "",
    review: game.status === "completed" ? (game.review ?? "") : "",
    user_rating: game.user_rating ? game.user_rating / 2 : 0,
    difficult: game.difficult ?? 0,
    completion_type: game.completion_type ?? "",
    platform_used: game.platform_used ?? "",
    hours_played: {
      hours: Math.floor(game.minutes_played / 60),
      minutes: game.minutes_played % 60,
    },
  };
}
