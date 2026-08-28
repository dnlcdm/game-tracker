import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import { GameDetailsHeader } from "./game-details-header";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";

const SHIMMER =
  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent before:animate-[shimmer_1.8s_ease-in-out_infinite] before:-translate-x-full";

const resolveHiRes = (url: string | undefined | null) => {
  if (!url) return "/not-found-image-1.png";
  return url.includes("t_cover_big")
    ? url.replace("t_cover_big", "t_1080p")
    : url;
};

const resolveCover = (url: string | undefined | null) => {
  if (!url) return "/not-found-image-1.png";
  return url.includes("t_cover_big")
    ? url.replace("t_cover_big", "t_720p")
    : url;
};

/* ─────────────────── fullscreen lightbox ─────────────────── */

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullscreenLightbox: FC<LightboxProps> = ({ src, alt, onClose }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const getDistance = (t1: React.Touch, t2: React.Touch) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const getCenter = (t1: React.Touch, t2: React.Touch) => ({
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        lastDistance.current = getDistance(e.touches[0], e.touches[1]);
        lastCenter.current = getCenter(e.touches[0], e.touches[1]);
      } else if (e.touches.length === 1) {
        isDragging.current = true;
        dragStart.current = {
          x: e.touches[0].clientX - translate.x,
          y: e.touches[0].clientY - translate.y,
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [translate],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastDistance.current !== null) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const ratio = dist / lastDistance.current;
        setScale((s) => Math.min(Math.max(s * ratio, 1), 5));
        lastDistance.current = dist;

        if (lastCenter.current) {
          const center = getCenter(e.touches[0], e.touches[1]);
          setTranslate((t) => ({
            x: t.x + (center.x - lastCenter.current!.x),
            y: t.y + (center.y - lastCenter.current!.y),
          }));
          lastCenter.current = center;
        }
      } else if (e.touches.length === 1 && isDragging.current && scale > 1) {
        setTranslate({
          x: e.touches[0].clientX - dragStart.current.x,
          y: e.touches[0].clientY - dragStart.current.y,
        });
      }
    },
    [scale],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length < 2) {
        lastDistance.current = null;
        lastCenter.current = null;
      }
      isDragging.current = false;

      if (scale <= 1.05) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      }
    },
    [scale],
  );

  const handleDoubleTap = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label={`Imagem em tela cheia: ${alt}`}
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-white/10 p-2 backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
        aria-label="Fechar visualização"
      >
        <CloseIcon fontSize="small" className="text-white" />
      </button>

      <motion.span
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        Pinça para zoom · Toque duplo para ampliar
      </motion.span>

      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="max-h-full max-w-full select-none object-contain"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: isDragging.current ? "none" : "transform 0.2s ease-out",
        }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      />
    </motion.div>
  );
};

type Props = {
  game: IGamesSupabase;
};

export const GameDetailsCover: FC<Props> = ({ game }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const coverSrc = resolveCover(game.coverUrl);
  const hiResSrc = resolveHiRes(game.coverUrl);

  const handleOpen = useCallback(() => setShowLightbox(true), []);
  const handleClose = useCallback(() => setShowLightbox(false), []);

  return (
    <>
      <div className="group relative w-full h-[35vh] md:h-full overflow-hidden">
        {!isLoaded && (
          <div
            className={`absolute inset-0 bg-gray-900 ${SHIMMER} overflow-hidden`}
            aria-hidden="true"
          />
        )}

        <motion.img
          src={coverSrc}
          alt={game.name}
          onLoad={() => setIsLoaded(true)}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{
            scale: isLoaded ? 1.03 : 1.08,
            opacity: isLoaded ? 1 : 0,
          }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-gray-950/10 md:to-gray-950"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(249,115,22,0.10),transparent_55%)]"
          aria-hidden="true"
        />

        <button
          onClick={handleOpen}
          className="
            absolute inset-0 z-[1] md:hidden cursor-zoom-in
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
          "
          aria-label={`Ver imagem de ${game.name} em tela cheia`}
        >
          <motion.span
            className="
              absolute top-3 left-3
              flex items-center gap-1.5 rounded-lg
              bg-black/50 backdrop-blur-md px-2.5 py-1.5
              border border-white/10
              text-[10px] font-semibold uppercase tracking-wider text-white/70
              shadow-lg
              transition-all duration-200
              group-hover:bg-black/60 group-hover:text-white/90
            "
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <ZoomOutMapIcon sx={{ fontSize: 13 }} />
            Expandir
          </motion.span>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-[2]">
          <div className="inline-flex max-w-full flex-col gap-2">
            <motion.div
              className="h-[2px] w-16 rounded-full bg-white/15 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            >
              <motion.div
                className="h-[2px] w-8 rounded-full bg-blue-400/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>

            <motion.h2
              className="
                text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white
                drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]
                line-clamp-2
              "
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            >
              {game.name}
            </motion.h2>

            <div className="pointer-events-none absolute -bottom-10 left-4 md:left-6 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
          </div>

          <motion.div
            className="absolute rounded-md top-0"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4, ease: "easeOut" }}
          >
            <GameDetailsHeader game={game} />
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]"
          aria-hidden="true"
        />
      </div>

      <AnimatePresence>
        {showLightbox && (
          <FullscreenLightbox
            src={hiResSrc}
            alt={game.name}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};
