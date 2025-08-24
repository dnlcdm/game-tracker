import { http, HttpResponse, type JsonBodyType } from "msw";
import { GAMES } from "../api/api-constants";
import gamesMocks from "./data/games/games.json";

const baseURL = import.meta.env.VITE_RAWG_API_URL;

export const handlers = [
  http.get(baseURL + GAMES, (): HttpResponse<JsonBodyType> => {
    return HttpResponse.json(gamesMocks);
  }),
];
