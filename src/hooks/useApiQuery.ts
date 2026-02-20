import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import apiClient from "../api/api-client";

type ApiError = Error;

interface Props<T> {
  options?: Omit<UseQueryOptions<T, ApiError>, "queryFn" | "queryKey">;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export const useApiQuery = <T>(
  endpoint: string,
  { options, params, headers }: Props<T>,
) => {
  const queryFn = async () => {
    const { data } = await apiClient.get<T>(endpoint, {
      params,
      headers: { ...headers },
    });
    return data;
  };

  const queryKey: QueryKey = [endpoint, params];

  return useQuery<T, ApiError>({
    queryKey,
    queryFn,
    retry: 0,
    ...options,
  });
};
