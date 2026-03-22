'use client';

import {
  SHEET_CONTEXT_TYPE,
  type SheetContext,
} from '@/components/bottomSheet/constants';
import { ExploreHeader, MenuHeader } from '@/components/header';
import { DEFAULT_ALBUM_TITLE } from '@/constants';

interface MapRouteHeaderProps {
  sheetContext: SheetContext;
  selectedAlbumTitle: string | undefined;
  address: string | null;
  profileImageUrl: string | undefined;
  onCloseAlbumDetail: () => void;
  onOpenAlbumRename: () => void;
  onOpenAlbumDelete: () => void;
  onOpenSidebar: () => void;
}

export const MapRouteHeader = ({
  sheetContext,
  selectedAlbumTitle,
  address,
  onCloseAlbumDetail,
  onOpenAlbumRename,
  onOpenAlbumDelete,
  onOpenSidebar,
}: MapRouteHeaderProps) => {
  if (sheetContext.type === SHEET_CONTEXT_TYPE.ALBUM_DETAIL) {
    const isDefaultAlbum = selectedAlbumTitle === DEFAULT_ALBUM_TITLE;
    return (
      <MenuHeader
        title={selectedAlbumTitle ?? '앨범'}
        onClickBack={onCloseAlbumDetail}
        showMenu={!isDefaultAlbum}
      >
        {!isDefaultAlbum && (
          <MenuHeader.Menu>
            <MenuHeader.Item onClick={onOpenAlbumRename}>앨범 이름 변경</MenuHeader.Item>
            <MenuHeader.Item variant="danger" onClick={onOpenAlbumDelete}>
              앨범 삭제
            </MenuHeader.Item>
          </MenuHeader.Menu>
        )}
      </MenuHeader>
    );
  }

  return (
    <ExploreHeader title={address || '위치 정보 로딩 중'} onClickMenu={onOpenSidebar} />
  );
};
