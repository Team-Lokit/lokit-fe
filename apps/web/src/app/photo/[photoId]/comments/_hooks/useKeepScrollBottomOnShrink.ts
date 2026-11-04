import { useEffect, useRef } from 'react';

/**
 * 스크롤 컨테이너의 높이가 줄어들면 줄어든 만큼 scrollTop을 올려 하단 기준으로 보이던 영역을 유지한다.
 *
 * Android WebView는 키보드가 올라오면 WebView 자체가 줄어들어 목록 하단(최신 댓글)이 가려진다.
 * iOS는 페이지가 통째로 위로 밀려 하단이 보이므로, Android에서도 같은 결과가 나오도록 맞춘다.
 * (iOS에서는 컨테이너 높이가 변하지 않으므로 동작하지 않는다)
 */
export default function useKeepScrollBottomOnShrink<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let prevHeight = el.clientHeight;
    const observer = new ResizeObserver(() => {
      const nextHeight = el.clientHeight;
      const shrunkBy = prevHeight - nextHeight;
      prevHeight = nextHeight;
      if (shrunkBy > 0) {
        el.scrollBy({ top: shrunkBy, behavior: 'smooth' });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
