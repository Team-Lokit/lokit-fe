'use client';

import { VIEW_CONTEXT_TYPE, type ViewContext } from '@/constants/viewContext';
import { ExploreHeader } from '@/components/header';
import AlbumMenu from '@/components/album-container/albumMenu/AlbumMenu';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import MenuIcon from '@/assets/images/menu.svg';
import { BUTTON_SIZE, ICON_SIZE } from '@/components/header/base/Header.constants';

interface MapRouteHeaderProps {
  viewContext: ViewContext;
  selectedAlbumTitle: string | undefined;
  address: string | null;
  onOpenSidebar: () => void;
  onRenameAlbum?: () => void;
  onDeleteAlbum?: () => void;
}

export const MapRouteHeader = ({
  viewContext,
  selectedAlbumTitle,
  address,
  onOpenSidebar,
  onRenameAlbum,
  onDeleteAlbum,
}: MapRouteHeaderProps) => {
  const isAlbumDetail = viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL;
  const title = isAlbumDetail
    ? (selectedAlbumTitle ?? '앨범')
    : address || '위치 정보 로딩 중';

  return (
    <ExploreHeader
      title={title}
      onClickMenu={onOpenSidebar}
      rightSlot={
        isAlbumDetail && onRenameAlbum && onDeleteAlbum ? (
          <AlbumMenu
            onRename={onRenameAlbum}
            onDelete={onDeleteAlbum}
            triggerElement={
              <CircleButton
                aria-label="앨범 메뉴"
                style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
              >
                <MenuIcon width={ICON_SIZE} height={ICON_SIZE} />
              </CircleButton>
            }
          />
        ) : undefined
      }
    />
  );
};
