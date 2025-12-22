import { http, HttpResponse, type JsonBodyType } from "msw";
import gamesMocks from "./data/games/games.json";

const baseURL = import.meta.env.VITE_MIDDLEWARE;

export const handlers = [
  http.get(baseURL + "test", (): HttpResponse<JsonBodyType> => {
    return HttpResponse.json(gamesMocks);
  }),
];
