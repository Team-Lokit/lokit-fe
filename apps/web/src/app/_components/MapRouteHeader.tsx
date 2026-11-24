'use client';

import { useHasUnreadNotifications } from '@repo/api-client';
import { VIEW_CONTEXT_TYPE, type ViewContext } from '@/constants/viewContext';
import { ExploreHeader } from '@/components/header';
import AlbumMenu from '@/components/album-container/albumMenu/AlbumMenu';
import { HeaderIconButton } from '@/components/header';
import MenuIcon from '@/assets/images/menu.svg';
import { DEFAULT_ALBUM_TITLE } from '@/constants';

interface MapRouteHeaderProps {
  viewContext: ViewContext;
  selectedAlbumTitle: string | undefined;
  onOpenSidebar: () => void;
  onRenameAlbum?: () => void;
  onDeleteAlbum?: () => void;
  onClickAlarm?: () => void;
}

export const MapRouteHeader = ({
  viewContext,
  selectedAlbumTitle,
  onOpenSidebar,
  onRenameAlbum,
  onDeleteAlbum,
  onClickAlarm,
}: MapRouteHeaderProps) => {
  const isAlbumDetail = viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL;
  const title = selectedAlbumTitle ?? DEFAULT_ALBUM_TITLE;
  const { data: unreadData } = useHasUnreadNotifications();

  return (
    <ExploreHeader
      title={title}
      onClickMenu={onOpenSidebar}
      onClickAlarm={onClickAlarm}
      hasUnreadNotification={unreadData?.hasUnread}
      rightSlot={
        isAlbumDetail && onRenameAlbum && onDeleteAlbum ? (
          <AlbumMenu
            onRename={onRenameAlbum}
            onDelete={onDeleteAlbum}
            triggerElement={<HeaderIconButton icon={MenuIcon} aria-label="앨범 메뉴" />}
          />
        ) : undefined
      }
    />
  );
};
