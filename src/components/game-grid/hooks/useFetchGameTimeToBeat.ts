import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/api-client";
import { PATHS } from "../../../constants/endpoint-paths.contants";

type TimeFmt = {
  seconds: number;
  hours: number;
  minutes: number;
  hoursDecimal: number;
  text: string;
} | null;

export type HltbItem = {
  id: number;
  name: string;
  url: string;
  times: {
    main_history: TimeFmt;
    main_plus_extra: TimeFmt;
    completionist: TimeFmt;
  };
};

const fetchHltb = async (name: string): Promise<HltbItem[]> => {
  const { data } = await apiClient.post<HltbItem[]>(PATHS.GAME_TIME_TO_BEAT, {
    name,
  });
  return Array.isArray(data) ? data : [];
};

export function useHltb(gameName: string) {
  return useQuery({
    queryKey: ["hltb" + gameName],
    queryFn: () => fetchHltb(gameName),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
