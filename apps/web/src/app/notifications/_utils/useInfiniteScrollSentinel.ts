import { useEffect, useRef } from 'react';

/**
 * 반환된 ref를 리스트 하단의 sentinel 엘리먼트에 붙이면,
 * 그 엘리먼트가 뷰포트에 보일 때 onIntersect를 호출한다(무한스크롤 트리거).
 */
export function useInfiniteScrollSentinel(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!enabled || !el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        onIntersectRef.current();
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
