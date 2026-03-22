'use client';

import {
  SHEET_CONTEXT_TYPE,
  type SheetContext,
} from '@/components/bottomSheet/constants';
import { ExploreHeader } from '@/components/header';

interface MapRouteHeaderProps {
  sheetContext: SheetContext;
  selectedAlbumTitle: string | undefined;
  address: string | null;
  onOpenSidebar: () => void;
}

export const MapRouteHeader = ({
  sheetContext,
  selectedAlbumTitle,
  address,
  onOpenSidebar,
}: MapRouteHeaderProps) => {
  const title =
    sheetContext.type === SHEET_CONTEXT_TYPE.ALBUM_DETAIL
      ? (selectedAlbumTitle ?? '앨범')
      : address || '위치 정보 로딩 중';

  return <ExploreHeader title={title} onClickMenu={onOpenSidebar} />;
};
