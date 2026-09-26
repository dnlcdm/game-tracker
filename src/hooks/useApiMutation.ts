import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import apiClient from "../api/api-client";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Props<TData, TError, TVariables, TContext = unknown> = {
  endpoint: string;
  method: Exclude<HttpMethod, "GET">;
  options?: UseMutationOptions<TData, TError, TVariables, TContext>;
  headers?: Record<string, string>;
};

export const useApiMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>({
  endpoint,
  method,
  options,
  headers,
}: Props<TData, TError, TVariables, TContext>) => {
  const mutationFn = async (variables: TVariables) => {
    const { data } = await apiClient({
      url: endpoint,
      method,
      data: variables,
      headers,
    });
    return data;
  };

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    retry: 0,
    ...options,
  });
};
