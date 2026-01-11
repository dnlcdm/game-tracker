import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";

interface SlotDigitProps {
  digit: number;
  isLoading: boolean;
  spinIntervalMs?: number;
  stopDelayMs?: number;
}

export const SlotDigit = ({
  digit,
  isLoading,
  spinIntervalMs = 70,
  stopDelayMs = 0,
}: SlotDigitProps) => {
  const REPEATS = 60; // 60 * 10 = 600 linhas

  const reel = useMemo(() => {
    const base = Array.from({ length: 10 }, (_, i) => String(i));
    const out: string[] = [];
    for (let r = 0; r < REPEATS; r++) out.push(...base);
    return out;
  }, []);

  const lineH = 18; // px
  const reelLen = reel.length;

  const y = useMotionValue(0);
  const loadingControls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    loadingControls.current?.stop();
    loadingControls.current = null;

    const extraTurns = 20;
    const safety = 10 + extraTurns + 10;
    const maxStart = Math.max(0, reelLen - safety);

    const startBase = Math.floor(Math.random() * Math.floor(maxStart / 10));
    const phase = Math.floor(Math.random() * 10);
    const startIndex = startBase * 10 + phase;

    y.set(-startIndex * lineH);

    const baseDurationSec = Math.max(0.45, (spinIntervalMs * 10) / 1000);
    const jitter = Math.random() * 0.2;

    loadingControls.current = animate(y, [y.get(), y.get() - lineH * 10], {
      duration: baseDurationSec + jitter,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => {
      loadingControls.current?.stop();
      loadingControls.current = null;
    };
  }, [isLoading, spinIntervalMs, lineH, reelLen, y]);

  useEffect(() => {
    if (isLoading) return;

    loadingControls.current?.stop();
    loadingControls.current = null;

    const timer = window.setTimeout(() => {
      const targetDigit = ((digit % 10) + 10) % 10;

      const currentSteps = Math.round(-y.get() / lineH);
      const currentDigit = ((currentSteps % 10) + 10) % 10;

      const delta = (targetDigit - currentDigit + 10) % 10;

      const extraTurns = 20;
      const targetSteps = currentSteps + extraTurns + delta;

      animate(y, -targetSteps * lineH, {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      });
    }, stopDelayMs);

    return () => window.clearTimeout(timer);
  }, [digit, isLoading, stopDelayMs, lineH, y]);

  return (
    <div className="relative h-[18px] overflow-hidden">
      <motion.div style={{ y }} className={isLoading ? "blur-[0.3px]" : ""}>
        {reel.map((txt, idx) => (
          <div
            key={`${txt}-${idx}`}
            className="h-[18px] leading-[18px] tabular-nums"
          >
            {txt}
          </div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
};
