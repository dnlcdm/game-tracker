import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  ms?: number;
  onStart?: () => void;
  onCancel?: () => void;
}

export function useLongPress(
  callback: () => void,
  { ms = 500, onStart, onCancel }: UseLongPressOptions = {},
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      triggered.current = false;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      onStart?.();

      timerRef.current = setTimeout(() => {
        triggered.current = true;
        if (navigator.vibrate) navigator.vibrate(50);
        callback();
      }, ms);
    },
    [callback, ms, onStart],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startPos.current.x);
      const dy = Math.abs(touch.clientY - startPos.current.y);

      if (dx > 10 || dy > 10) {
        clear();
        onCancel?.();
      }
    },
    [clear, onCancel],
  );

  const onTouchEnd = useCallback(() => {
    clear();
    if (!triggered.current) onCancel?.();
  }, [clear, onCancel]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    triggered,
  };
}
