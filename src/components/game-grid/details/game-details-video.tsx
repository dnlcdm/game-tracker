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

type SwipeProps = {
  screenshots: string[];
  initialIndex: number;
  onChange: (idx: number) => void;
};

const SWIPE_THRESHOLD = 60;

const ScreenshotSwipe = ({ screenshots, initialIndex }: SwipeProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [dragDir, setDragDir] = useState<"left" | "right" | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(
    () => new Set([initialIndex]),
  );

  const markLoaded = (i: number) =>
    setLoaded((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });

  const preload = (offset: -1 | 1) => {
    const next = index + offset;
    if (next >= 0 && next < screenshots.length && !loaded.has(next)) {
      const img = new Image();
      img.src = screenshots[next];
      img.onload = () => markLoaded(next);
    }
  };

  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: "0%", opacity: 1 },
    exit: (dir: "left" | "right") => ({
      x: dir === "left" ? "-50%" : "50%",
      opacity: 0,
    }),
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -200) {
      setDragDir("left");
      setIndex((i) => Math.min(screenshots.length - 1, i + 1));
    } else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 200) {
      setDragDir("right");
      setIndex((i) => Math.max(0, i - 1));
    }
  };

  return (
    <>
      <div className="relative bg-black select-none overflow-hidden">
        <motion.div
          key={index}
          custom={dragDir ?? "left"}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
          onTouchStart={() => {
            preload(-1);
            preload(1);
          }}
          onDragStart={() => {
            preload(-1);
            preload(1);
          }}
          className="relative cursor-grab active:cursor-grabbing aspect-video min-h-[200px]"
        >
          <img
            src={screenshots[index]}
            alt={`Screenshot ${index + 1}`}
            className="w-full h-full object-contain pointer-events-none"
            onLoad={() => markLoaded(index)}
            style={{ transition: "opacity 0.15s ease" }}
            loading={loaded.has(index) ? "eager" : "lazy"}
          />
        </motion.div>

        {!loaded.has(index) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
          </div>
        )}

        {screenshots.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {screenshots.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDragDir(i > index ? "left" : "right");
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Jump to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 flex items-center justify-center">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400">
          {index + 1} / {screenshots.length}
        </div>
      </div>
    </>
  );
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
        {shotOpen && screenshots?.[shotOpen.idx] != null && (
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

              <ScreenshotSwipe
                screenshots={screenshots}
                initialIndex={shotOpen.idx}
                onChange={(idx) => setShotOpen({ idx })}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
