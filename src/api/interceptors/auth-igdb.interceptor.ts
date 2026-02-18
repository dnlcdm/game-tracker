import type { AxiosInstance } from "axios";
import { authService } from "../../services/auth.service";
import { PATHS } from "../../constants/endpoint-paths.contants";
import { supabase } from "../../services/supabase-client.service";

export const authIgdbRequest = (apiClient: AxiosInstance) =>
  apiClient.interceptors.request.use(async (request) => {
    const isRequiredIGDBEndpoint = request.url?.includes(PATHS.IGDB_GAMES);

    const token = authService.getToken();
    const { data } = await supabase.auth.getSession();
      const supabaseToken = data.session?.access_token;

    request.headers.Authorization = `Bearer ${isRequiredIGDBEndpoint ? token : supabaseToken}`;

    return request;
  });

export const authIgdbResponse = (apiClient: AxiosInstance) =>
  apiClient.interceptors.response.use((response) => {
    const path = "/get-token";
    const isAuthEndpoint = response.config.url?.includes(path);

    if (!isAuthEndpoint) return response;

    authService.setToken(response.data.access_token);

    return response;
  });
