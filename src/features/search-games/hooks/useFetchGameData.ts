import type { ApiIgdbPaginationResponse } from "../../../api/types/response.type";
import { PATHS } from "../../../constants/endpoint-paths.contants";
import { useApiQuery } from "../../../hooks/useApiQuery";
import type { IGames } from "../types/games.types";

export const useFetchGameData = (params: Record<string, string>) => {
  return useApiQuery<ApiIgdbPaginationResponse<IGames>>(PATHS.IGDB_GAMES, {
    params,
  });
};
