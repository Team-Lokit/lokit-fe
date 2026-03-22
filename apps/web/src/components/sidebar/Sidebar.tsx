'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AlbumThumbnails } from '@repo/api-client';
import Input from '@/components/input/Input';
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
  selectedAlbumId?: number | null;
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
  selectedAlbumId,
  onExplore,
  onNewAlbum,
  onSelectAlbum,
  onMyPage,
}: SidebarProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <S.Backdrop $isOpen={isOpen} $isClosing={isClosing} onClick={handleClose} />
      <S.Container $isOpen={isOpen} $isClosing={isClosing} aria-label="사이드바">
        <S.Content>
          <S.Section>
            <SidebarHeader onClose={handleClose} />
            <S.SearchWrapper>
              <Input
                type="search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="앨범을 검색해보세요..."
                showCharCount={false}
              />
            </S.SearchWrapper>
            <SidebarMenu onExplore={onExplore} onNewAlbum={onNewAlbum} />
          </S.Section>
          <AlbumList
            albums={albums}
            searchValue={searchValue}
            selectedAlbumId={selectedAlbumId}
            onSelectAlbum={onSelectAlbum}
          />
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
