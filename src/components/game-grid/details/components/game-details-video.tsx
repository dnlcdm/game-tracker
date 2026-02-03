import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

type Trailer = {
  name?: string | null;
  youtubeId: string;
  watchUrl?: string;
  embedUrl?: string;
};

type Props = {
  trailers?: Trailer[] | null;
  screenshots?: string[] | null;
  maxTiles?: number;
};

const ytThumb = (id: string) => {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

const ytThumbFallback = (id: string) => {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export const GameDetailsMediaGrid = ({
  trailers,
  screenshots,
  maxTiles = 4,
}: Props) => {
  const hasTrailers = (trailers?.length ?? 0) > 0;
  const hasShots = (screenshots?.length ?? 0) > 0;

  const [videoOpen, setVideoOpen] = useState(false);
  const [activeTrailerIndex, setActiveTrailerIndex] = useState(0);

  const [shotOpen, setShotOpen] = useState<null | { idx: number }>(null);

  const activeTrailer = useMemo(() => {
    const list = trailers ?? [];
    return list[Math.min(activeTrailerIndex, Math.max(0, list.length - 1))];
  }, [trailers, activeTrailerIndex]);

  const tiles = useMemo(() => {
    const out: Array<
      | {
          type: "video";
          key: string;
          title: string;
          thumb: string;
          youtubeId: string;
        }
      | { type: "shot"; key: string; url: string; idx: number }
    > = [];

    if (hasTrailers) {
      const t = trailers![0];
      out.push({
        type: "video",
        key: `video-${t.youtubeId}`,
        title: t.name || "Trailer",
        thumb: ytThumb(t.youtubeId),
        youtubeId: t.youtubeId,
      });
    }

    if (hasShots) {
      screenshots!.forEach((url, idx) => {
        out.push({ type: "shot", key: `shot-${idx}-${url}`, url, idx });
      });
    }

    return out.slice(0, maxTiles);
  }, [hasTrailers, hasShots, trailers, screenshots, maxTiles]);

  if (!hasTrailers && !hasShots) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 opacity-70">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          Mídia
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          if (tile.type === "video") {
            return (
              <button
                key={tile.key}
                type="button"
                onClick={() => {
                  setActiveTrailerIndex(0);
                  setVideoOpen(true);
                }}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <div className="relative aspect-video">
                  <img
                    src={tile.thumb}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        ytThumbFallback(tile.youtubeId);
                    }}
                    alt={tile.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-black/55 border border-white/15 px-4 py-2 backdrop-blur-md">
                      <PlayArrowRoundedIcon className="text-white" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                        Vídeo
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/85 line-clamp-1">
                      {tile.title}
                    </div>
                  </div>

                  {(trailers?.length ?? 0) > 1 && (
                    <div className="absolute top-2 left-2 rounded-md bg-black/60 border border-white/10 px-2 py-1 text-[10px] font-black text-white/80">
                      +{(trailers?.length ?? 1) - 1}
                    </div>
                  )}
                </div>
              </button>
            );
          }

          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => setShotOpen({ idx: tile.idx })}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <div className="relative aspect-video">
                <img
                  src={tile.url}
                  alt={`Screenshot ${tile.idx + 1}`}
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {videoOpen && activeTrailer?.youtubeId && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setVideoOpen(false)}
            />

            <motion.div
              className="relative w-[92vw] max-w-3xl rounded-2xl border border-white/10 bg-gray-950 shadow-2xl overflow-hidden"
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white/90 hover:bg-white/10 transition border border-white/10 backdrop-blur"
                aria-label="Fechar vídeo"
              >
                <CloseIcon data-testid="CloseIcon" fontSize="small" />
              </button>

              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${activeTrailer.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeTrailer.name || "Vídeo"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {(trailers?.length ?? 0) > 1 && (
                <div className="p-4 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trailers!.slice(0, 6).map((t, idx) => {
                      const active = idx === activeTrailerIndex;
                      return (
                        <button
                          key={`${t.youtubeId}-${idx}`}
                          type="button"
                          onClick={() => setActiveTrailerIndex(idx)}
                          className={[
                            "px-3 py-2 rounded-lg border transition text-left",
                            "bg-white/[0.03] hover:bg-white/[0.06] border-white/10",
                            active
                              ? "ring-1 ring-white/20 text-white"
                              : "text-gray-300",
                          ].join(" ")}
                        >
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1">
                            {t.name || `Vídeo ${idx + 1}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shotOpen && screenshots?.[shotOpen.idx] && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setShotOpen(null)}
            />

            <motion.div
              className="relative w-[92vw] max-w-4xl rounded-2xl border border-white/10 bg-gray-950 shadow-2xl overflow-hidden"
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                onClick={() => setShotOpen(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white/90 hover:bg-white/10 transition border border-white/10 backdrop-blur"
                aria-label="Fechar imagem"
              >
                <CloseIcon data-testid="CloseIcon" fontSize="small" />
              </button>

              <div className="bg-black">
                <img
                  src={screenshots[shotOpen.idx]}
                  alt={`Screenshot ${shotOpen.idx + 1}`}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Screenshot {shotOpen.idx + 1} / {screenshots.length}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShotOpen((s) =>
                        s ? { idx: Math.max(0, s.idx - 1) } : s,
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-[10px] font-black uppercase tracking-[0.2em] text-gray-300"
                    disabled={shotOpen.idx === 0}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setShotOpen((s) =>
                        s
                          ? { idx: Math.min(screenshots.length - 1, s.idx + 1) }
                          : s,
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-[10px] font-black uppercase tracking-[0.2em] text-gray-300"
                    disabled={shotOpen.idx === screenshots.length - 1}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
