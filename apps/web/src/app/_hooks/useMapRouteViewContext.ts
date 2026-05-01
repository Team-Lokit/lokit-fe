'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { VIEW_CONTEXT_TYPE, ViewContext } from '@/constants/viewContext';
import { extractAlbumIdFromPath, getSelectedAlbumId } from '../_utils/mapRoute.calc';

interface UseMapRouteViewContextReturn {
  viewContext: ViewContext;
  setViewContext: (context: ViewContext) => void;
  selectedAlbumId: number | null;
  albumIdFromPath: number | null;
}

/**
 * 뷰 컨텍스트와 네비게이션 상태를 관리하는 커스텀 훅
 * - 뷰 컨텍스트의 현재 컨텍스트를 추적
 * - URL 경로에서 앨범 ID를 자동으로 감지
 * - 경로 변경 시 뷰 컨텍스트 상태를 동기화
 */
export const useMapRouteViewContext = (): UseMapRouteViewContextReturn => {
  const pathname = usePathname();
  // URL 경로에서 앨범 ID 추출
  const albumIdFromPath = useMemo(() => {
    return extractAlbumIdFromPath(pathname);
  }, [pathname]);

  // 초기 상태를 URL 경로 기반으로 설정
  const [viewContext, setViewContext] = useState<ViewContext>(() => {
    if (albumIdFromPath) {
      return { type: VIEW_CONTEXT_TYPE.ALBUM_DETAIL, albumId: albumIdFromPath };
    }
    return { type: VIEW_CONTEXT_TYPE.HOME };
  });

  // 경로가 변경되었을 때 뷰 컨텍스트 상태 동기화
  useEffect(() => {
    if (albumIdFromPath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 경로 변경 시 뷰 컨텍스트 상태 동기화
      setViewContext({
        type: VIEW_CONTEXT_TYPE.ALBUM_DETAIL,
        albumId: albumIdFromPath,
      });
    } else {
      setViewContext({ type: VIEW_CONTEXT_TYPE.HOME });
    }
  }, [albumIdFromPath]);

  // 선택된 앨범 ID 계산
  const selectedAlbumId = useMemo(() => {
    return getSelectedAlbumId(albumIdFromPath, viewContext);
  }, [albumIdFromPath, viewContext]);

  return {
    viewContext,
    setViewContext,
    selectedAlbumId,
    albumIdFromPath,
  };
};
