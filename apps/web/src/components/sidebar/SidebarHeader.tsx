import styled from '@emotion/styled';
import LokitWordmark from '@/assets/images/lokitWordmark.svg';
import CloseIcon from '@/assets/images/close.svg';

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  return (
    <Container>
      <Logo>
        <LokitWordmark />
      </Logo>
      <CloseButton onClick={onClose} aria-label="사이드바 닫기">
        <CloseIcon />
      </CloseButton>
    </Container>
  );
};

export default SidebarHeader;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
`;

const Logo = styled.div`
  width: 60px;
  height: 14px;
  color: ${({ theme }) => theme.colors.gray[0]};
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray[200]};
`;
