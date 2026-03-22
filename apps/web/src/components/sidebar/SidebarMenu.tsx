import styled from '@emotion/styled';
import ExploreIcon from '@/assets/images/explore.svg';
import NewAlbumIcon from '@/assets/images/newAlbum.svg';

interface SidebarMenuProps {
  onExplore: () => void;
  onNewAlbum: () => void;
}

const SidebarMenu = ({ onExplore, onNewAlbum }: SidebarMenuProps) => {
  return (
    <Container>
      <MenuItem onClick={onExplore}>
        <IconWrapper>
          <ExploreIcon />
        </IconWrapper>
        <Label>탐색</Label>
      </MenuItem>
      <MenuItem onClick={onNewAlbum}>
        <IconWrapper>
          <NewAlbumIcon />
        </IconWrapper>
        <Label>새 앨범</Label>
      </MenuItem>
    </Container>
  );
};

export default SidebarMenu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 12px;
  border-radius: 12px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body16Medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;
