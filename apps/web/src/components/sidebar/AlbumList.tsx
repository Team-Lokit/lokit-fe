import styled from '@emotion/styled';
import type { AlbumThumbnails } from '@repo/api-client';
import { useMemo, useState } from 'react';
import Input from '@/components/input/Input';
import AlbumListItem from './AlbumListItem';

interface AlbumListProps {
  albums: AlbumThumbnails[];
  onSelectAlbum: (albumId: number) => void;
}

const AlbumList = ({ albums, onSelectAlbum }: AlbumListProps) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredAlbums = useMemo(() => {
    const keyword = searchValue.trim();
    if (!keyword) return albums;
    return albums.filter((album) => album.title?.includes(keyword));
  }, [albums, searchValue]);

  return (
    <Container>
      <SearchSection>
        <Input
          type="search"
          value={searchValue}
          onChange={setSearchValue}
          placeholder="앨범을 검색해보세요..."
          showCharCount={false}
        />
      </SearchSection>
      <Section>
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
      </Section>
    </Container>
  );
};

export default AlbumList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow: hidden;
`;

const SearchSection = styled.div`
  padding: 0 12px;
`;

const Section = styled.div`
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
