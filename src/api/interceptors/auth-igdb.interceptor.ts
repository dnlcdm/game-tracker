import type { AxiosInstance } from "axios";
import { authService } from "../../services/auth.service";

export const authIgdbRequest = (apiClient: AxiosInstance) =>
  apiClient.interceptors.request.use((request) => {
    const urlBase = "/api/games";
    const isIgbdEndpoint = urlBase === request.url;
    if (!isIgbdEndpoint) return request;

    const token = authService.getToken();

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  });

export const authIgdbResponse = (apiClient: AxiosInstance) =>
  apiClient.interceptors.response.use((response) => {
    const path = "/auth/token";
    const isAuthEndpoint = response.config.url?.includes(path);

    if (!isAuthEndpoint) return response;

    authService.setToken(response.data.access_token);

    return response;
  });
