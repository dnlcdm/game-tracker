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
  apiClient.interceptors.response.use(async (response) => {
    const isAuthEndpoint = response.config.url?.includes(PATHS.IGDB_TOKEN);

    if (!isAuthEndpoint) return response;

    await authService.setToken(response.data.access_token);

    return response;
  });
