import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import apiClient from "../api/api-client";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Props = {
  endpoint: string;
  method: Exclude<HttpMethod, "GET">;
  options?: UseMutationOptions<unknown, unknown, unknown>;
  headers: Record<string, string>;
};

export const useApiMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
>({
  endpoint,
  method,
  options,
  headers,
}: Props) => {
  const mutationFn = async (variables: TVariables) => {
    const { data } = await apiClient({
      url: endpoint,
      method,
      data: variables,
      headers,
    });
    return data;
  };

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    retry: 0,
    ...options,
  });
};
