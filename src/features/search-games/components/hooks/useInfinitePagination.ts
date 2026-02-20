import { useEffect, useRef, type Dispatch, type RefObject, type SetStateAction } from "react";

type UseInfinitePaginationProps = {
  observerTarget: RefObject<HTMLDivElement | null>;
  isPending: boolean;
  hasMore: boolean;
  setParams: Dispatch<SetStateAction<GameParams>>;
};

export type GameParams = Record<string, string>;

const OBSERVER_THRESHOLD = 0.1;

export const useInfinitePagination = ({
  observerTarget,
  isPending,
  hasMore,
  setParams,
}: UseInfinitePaginationProps) => {
  const hasUserScrolledRef = useRef(false);
  const isPendingRef = useRef(isPending);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    isPendingRef.current = isPending;
  }, [isPending]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (window.scrollY > 0) {
        hasUserScrolledRef.current = true;
        return;
      }

      const target = event.target;
      if (target instanceof Element && target.scrollTop > 0) {
        hasUserScrolledRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (!hasUserScrolledRef.current) return;
        if (isPendingRef.current || !hasMoreRef.current) return;

        setParams((prev) => ({
          ...prev,
          page: String(Number(prev.page || '1') + 1),
        }));
      },
      { threshold: OBSERVER_THRESHOLD },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [observerTarget, setParams]);
};