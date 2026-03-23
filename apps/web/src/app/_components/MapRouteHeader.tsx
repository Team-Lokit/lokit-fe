'use client';

import { VIEW_CONTEXT_TYPE, type ViewContext } from '@/constants/viewContext';
import { ExploreHeader } from '@/components/header';

interface MapRouteHeaderProps {
  viewContext: ViewContext;
  selectedAlbumTitle: string | undefined;
  address: string | null;
  onOpenSidebar: () => void;
}

export const MapRouteHeader = ({
  viewContext,
  selectedAlbumTitle,
  address,
  onOpenSidebar,
}: MapRouteHeaderProps) => {
  const title =
    viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL
      ? (selectedAlbumTitle ?? '앨범')
      : address || '위치 정보 로딩 중';

  return <ExploreHeader title={title} onClickMenu={onOpenSidebar} />;
};
