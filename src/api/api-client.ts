import axios from "axios";

const env = import.meta.env;
const baseURL = env.VITE_RAWG_API_URL;
const key = env.VITE_RAWG_API_KEY;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key,
  };

  return config;
});

export default apiClient;
