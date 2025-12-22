const baseUrl = import.meta.env.VITE_MIDDLEWARE;

export const PATHS = {
  IGDB_GAMES: baseUrl + "/api/games",
  IGDB_TOKEN: baseUrl + "/auth/token",
};
