import { useEffect, useState } from "react";

interface FreeGame {
  titulo: string;
  descricao: string;
  foto: string;
  data_inicio: string;
  data_fim: string;
  link: string;
}

const FreeGameCard = () => {
  const [games, setGames] = useState<FreeGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://navfbtaxterxdcjjtfco.supabase.co/functions/v1/hyper-api",
        );
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-slate-400 font-medium">
        <span className="animate-pulse">Buscando ofertas da Epic Games...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto py-4 space-y-4">
      {games?.map((game, index) => (
        <div
          key={index}
          className="group flex flex-col md:flex-row bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-500 transition-all duration-300"
        >
          <div className="relative w-full md:w-72 h-40 md:h-auto shrink-0 overflow-hidden">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={
                game.foto ||
                "https://via.placeholder.com/400x225?text=Epic+Games"
              }
              alt={game.titulo}
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded text-white tracking-widest uppercase">
              Grátis
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 w-full">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-xl font-bold text-white leading-tight">
                  {game.titulo}
                </h2>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                {game.descricao}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                  Expira em
                </span>
                <span className="text-sm text-cyan-400 font-semibold">
                  {new Date(game.data_fim).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <a
                href={game.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-cyan-400 text-slate-900 text-xs font-black py-2.5 px-6 rounded transition-colors uppercase tracking-widest text-center"
              >
                Resgatar Jogo
              </a>
            </div>
          </div>
        </div>
      ))}

      {games.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          Nenhum jogo gratuito disponível no momento.
        </div>
      )}
    </div>
  );
};

export default FreeGameCard;
