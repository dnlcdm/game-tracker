import type { AxiosInstance } from "axios";
import { authService } from "../../services/auth.service";
import { PATHS } from "../../constants/endpoint-paths.contants";
import { supabase } from "../../services/supabase-client.service";

let igdbTokenRequest: Promise<string | null> | null = null;

const ensureIgdbToken = async (apiClient: AxiosInstance) => {
  const cachedToken = authService.getToken();
  if (cachedToken) return cachedToken;

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
        request.headers.Authorization = `Bearer ${igdbToken}`;
      }

      return request;
    }

    const hasAuthorizationHeader = Boolean(request.headers.Authorization);
    if (hasAuthorizationHeader) {
      return request;
    }

    const { data } = await supabase.auth.getSession();
    const supabaseToken = data.session?.access_token;

    if (supabaseToken) {
      request.headers.Authorization = `Bearer ${supabaseToken}`;
    }

    return request;
  });

export const authIgdbResponse = (apiClient: AxiosInstance) =>
  apiClient.interceptors.response.use(async (response) => {
    const isAuthEndpoint = response.config.url?.includes(PATHS.IGDB_TOKEN);

    if (!isAuthEndpoint) return response;

    await authService.setToken(response.data.access_token);

    return response;
  });
