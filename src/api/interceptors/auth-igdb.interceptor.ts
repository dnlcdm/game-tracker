import type { AxiosInstance } from "axios";
import { authService } from "../../services/auth.service";
import { PATHS } from "../../constants/endpoint-paths.contants";
import { supabase } from "../../services/supabase-client.service";

let igdbTokenRequest: Promise<string | null> | null = null;

const ensureIgdbToken = async (
  apiClient: AxiosInstance,
  forceRefresh = false,
) => {
  if (!forceRefresh) {
    const cachedToken = authService.getToken();
    if (cachedToken) return cachedToken;
  } else {
    authService.setToken("");
  }

  if (!igdbTokenRequest) {
    igdbTokenRequest = apiClient
      .get<{ access_token?: string }>(PATHS.IGDB_TOKEN)
      .then(({ data }) => {
        const token = data?.access_token ?? null;

        if (token) {
          authService.setToken(token);
        }

        return token;
      })
      .finally(() => {
        igdbTokenRequest = null;
      });
  }

  return igdbTokenRequest;
};

export const authIgdbRequest = (apiClient: AxiosInstance) =>
  apiClient.interceptors.request.use(async (request) => {
    const isRequiredIGDBEndpoint = request.url?.includes(PATHS.IGDB_GAMES);

    if (isRequiredIGDBEndpoint) {
      const igdbToken = await ensureIgdbToken(apiClient);

      if (igdbToken) {
        request.headers["x-igdb-token"] = `Bearer ${igdbToken}`;
      }
    }

    const hasAuthorizationHeader = Boolean(request.headers.Authorization);
    if (!hasAuthorizationHeader) {
      const { data } = await supabase.auth.getSession();
      const supabaseToken = data.session?.access_token;

      if (supabaseToken) {
        request.headers.Authorization = `Bearer ${supabaseToken}`;
      }
    }

    return request;
  });

export const authIgdbResponse = (apiClient: AxiosInstance) =>
  apiClient.interceptors.response.use(
    async (response) => {
      const isAuthEndpoint = response.config.url?.includes(PATHS.IGDB_TOKEN);

      if (!isAuthEndpoint) return response;

      authService.setToken(response.data.access_token);

      console.log(response.data);

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      const errorData = error.response?.data;
      const errorMessage =
        typeof errorData === "string" ? errorData : errorData?.error;

      const isIgdbAuthError =
        originalRequest.url?.includes(PATHS.IGDB_GAMES) &&
        errorMessage &&
        typeof errorMessage === "string" &&
        errorMessage.includes("IGDB games error (401)");

      if (isIgdbAuthError) {
        originalRequest._retry = true;

        try {
          const newToken = await ensureIgdbToken(apiClient, true);

          if (newToken) {
            originalRequest.headers["x-igdb-token"] = `Bearer ${newToken}`;

            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
