import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/api-client";
import { PATHS } from "../../../constants/endpoint-paths.contants";
import { useUserAuth } from "./useUserAuth";

const fetchAccessToken = async () => {
  const response = await apiClient.get(PATHS.IGDB_TOKEN);
  return response.data;
};

export const useAuthIGDB = () => {
  const { session } = useUserAuth();

  const { isPending, ...queryResult } = useQuery({
    queryKey: ["igdb-token"],
    queryFn: fetchAccessToken,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!session?.access_token,
  });

  return {
    isPending,
    ...queryResult,
  };
};