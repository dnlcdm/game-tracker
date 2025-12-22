import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/api-client";
import { PATHS } from "../../../constants/endpoint-paths.contants";

const fetchAccessToken = async () => {
  const response = await apiClient.get(PATHS.IGDB_TOKEN);
  return response.data;
};

export const useAuth = () => {
  const { isPending, ...queryResult } = useQuery({
    queryKey: ["AccessToken"],
    queryFn: fetchAccessToken,
    refetchOnWindowFocus: false,
  });

  return {
    isPending,
    ...queryResult,
  };
};
