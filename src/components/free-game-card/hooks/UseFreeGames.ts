import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../../features/auth/hooks/useUserAuth";
import { PATHS } from "../../../constants/endpoint-paths.contants";

export interface FreeGame {
  titulo: string;
  descricao: string;
  foto: string;
  data_inicio: string;
  data_fim: string;
  link: string;
}

export const useFreeGames = () => {
  const { session } = useUserAuth();

  return useQuery<FreeGame[]>({
    queryKey: ["epic-free-games"],
    queryFn: async () => {
      const response = await fetch(PATHS.FREE_GAME_EPIC, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar jogos gratuitos");
      }

      return response.json();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!session?.access_token,
  });
};
