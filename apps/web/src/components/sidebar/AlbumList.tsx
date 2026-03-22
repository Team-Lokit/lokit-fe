import styled from '@emotion/styled';
import type { AlbumThumbnails } from '@repo/api-client';
import { useMemo } from 'react';
import AlbumListItem from './AlbumListItem';

interface AlbumListProps {
  albums: AlbumThumbnails[];
  searchValue: string;
  onSelectAlbum: (albumId: number) => void;
}

const AlbumList = ({ albums, searchValue, onSelectAlbum }: AlbumListProps) => {
  const filteredAlbums = useMemo(() => {
    const keyword = searchValue.trim();
    if (!keyword) return albums;
    return albums.filter((album) => album.title?.includes(keyword));
  }, [albums, searchValue]);

  return (
    <Container>
      <SectionLabel>앨범</SectionLabel>
      <List>
        {filteredAlbums.map((album, index) => (
          <AlbumListItem
            key={album.id}
            title={album.title ?? ''}
            totalCount={album.photoCount ?? 0}
            isSelected={index === 0}
            showMenu={index !== 0}
            onClick={() => onSelectAlbum(album.id ?? 0)}
          />
        ))}
      </List>
    </Container>
  );
};

export default AlbumList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
  flex: 1;
  overflow-y: auto;
`;

const SectionLabel = styled.div`
  ${({ theme }) => theme.typography.body14Regular};
  color: ${({ theme }) => theme.colors.gray[500]};
  padding: 0 12px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
