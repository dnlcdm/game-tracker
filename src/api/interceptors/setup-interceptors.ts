import type { AxiosInstance } from "axios";
import { authIgdbRequest, authIgdbResponse } from "./auth-igdb.interceptor";

export const setupInterceptors = (apiClient: AxiosInstance) => {
  authIgdbResponse(apiClient);
  authIgdbRequest(apiClient);
};
