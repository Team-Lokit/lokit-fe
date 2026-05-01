import styled from '@emotion/styled';
import AlbumMenu from '@/components/album-container/albumMenu/AlbumMenu';
import type { ReactNode } from 'react';

interface AlbumListItemProps {
  icon?: ReactNode;
  title: string;
  totalCount?: number;
  showMenu?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

const AlbumListItem = ({
  icon,
  title,
  totalCount,
  showMenu = false,
  isSelected = false,
  onClick,
  onRename,
  onDelete,
}: AlbumListItemProps) => {
  return (
    <Container $isSelected={isSelected} onClick={onClick} data-album-list-item>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <TextGroup>
        <Title>{title}</Title>
        {totalCount !== undefined && <Count>{totalCount}</Count>}
      </TextGroup>
      {showMenu && onRename && onDelete && (
        <AlbumMenu onRename={onRename} onDelete={onDelete} />
      )}
    </Container>
  );
};

export default AlbumListItem;

const Container = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.15s ease;
  background-color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.blueWhite.bg8 : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
`;

const Title = styled.span`
  ${({ theme }) => theme.typography.body16Medium};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  ${({ theme }) => theme.typography.body16Medium};
  color: ${({ theme }) => theme.colors.gray[400]};
  flex-shrink: 0;
`;
