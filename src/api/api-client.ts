import axios from "axios";
import { setupInterceptors } from "./interceptors/setup-interceptors";

const env = import.meta.env;
const baseURL = env.VITE_MIDDLEWARE;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(apiClient);

export default apiClient;
