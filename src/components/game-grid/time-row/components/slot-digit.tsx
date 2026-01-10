import { useEffect, useMemo } from "react";
import { motion, animate, useMotionValue } from "framer-motion";

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
  const reel = useMemo(() => {
    const base = Array.from({ length: 10 }, (_, i) => String(i));
    return [...base, ...base, ...base, ...base, ...base, ...base];
  }, []);

  const lineH = 18;
  const reelLen = reel.length;

  const y = useMotionValue(0);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isLoading) {
      let idx = Math.floor(Math.random() * reelLen);

      intervalId = window.setInterval(() => {
        const jump = 2 + Math.floor(Math.random() * 5);
        idx = (idx + jump) % reelLen;
        y.set(-idx * lineH);
      }, spinIntervalMs);

      return () => {
        if (intervalId) window.clearInterval(intervalId);
      };
    }

    const safeDigit = ((digit % 10) + 10) % 10;
    const targetIndex = reelLen - 10 + safeDigit;

    const stopTimer = window.setTimeout(() => {
      const controls = animate(y, -targetIndex * lineH, {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      });

      return () => controls.stop();
    }, stopDelayMs);

    return () => window.clearTimeout(stopTimer);
  }, [digit, isLoading, lineH, reelLen, spinIntervalMs, stopDelayMs, y]);

  return (
    <div className="relative h-[18px] overflow-hidden">
      <motion.div style={{ y }}>
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
