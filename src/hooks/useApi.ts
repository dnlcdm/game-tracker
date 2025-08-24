import {
  useQuery,
  useMutation,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import apiClient from "../api/api-client";

type ApiError = Error;
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const useApiQuery = <T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T, ApiError>, "queryFn" | "queryKey">,
) => {
  const queryFn = async () => {
    const { data } = await apiClient.get<T>(endpoint);
    return data;
  };

  const queryKey: QueryKey = [endpoint];

  return useQuery<T, ApiError>({
    queryKey,
    queryFn,
    retry: 0,
    ...options,
  });
};

export const useApiMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
>(
  endpoint: string,
  method: Exclude<HttpMethod, "GET">,
  options?: UseMutationOptions<TData, TError, TVariables>,
) => {
  const mutationFn = async (variables: TVariables) => {
    const { data } = await apiClient({
      url: endpoint,
      method,
      data: variables,
    });
    return data;
  };

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    retry: 0,
    ...options,
  });
};
