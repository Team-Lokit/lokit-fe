'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AlbumThumbnails } from '@repo/api-client';
import * as S from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import AlbumList from './AlbumList';
import SidebarMy from './SidebarMy';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  albums: AlbumThumbnails[];
  nickname: string;
  dDay: number;
  profileImageUrl?: string;
  onExplore: () => void;
  onNewAlbum: () => void;
  onSelectAlbum: (albumId: number) => void;
  onMyPage: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  albums,
  nickname,
  dDay,
  profileImageUrl,
  onExplore,
  onNewAlbum,
  onSelectAlbum,
  onMyPage,
}: SidebarProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <S.Backdrop $isOpen={isOpen} $isClosing={isClosing} onClick={handleClose} />
      <S.Container $isOpen={isOpen} $isClosing={isClosing} aria-label="사이드바">
        <S.Content>
          <div style={{ padding: '0 12px' }}>
            <SidebarHeader onClose={handleClose} />
          </div>
          <div
            style={{
              padding: '0 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <SidebarMenu onExplore={onExplore} onNewAlbum={onNewAlbum} />
          </div>
          <AlbumList albums={albums} onSelectAlbum={onSelectAlbum} />
        </S.Content>
        <S.Footer>
          <SidebarMy
            nickname={nickname}
            dDay={dDay}
            profileImageUrl={profileImageUrl}
            onClick={onMyPage}
          />
        </S.Footer>
      </S.Container>
    </>
  );
};

export default Sidebar;
