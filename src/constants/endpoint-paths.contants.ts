const baseUrl = import.meta.env.VITE_MIDDLEWARE;

export const PATHS = {
  IGDB_GAMES: baseUrl + "/node-api/api/games",
  IGDB_TOKEN: baseUrl + "/node-api/auth/token",
  FREE_GAME_EPIC: baseUrl + "/hyper-api",
};
