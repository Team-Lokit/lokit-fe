import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.modal - 1};
`;

export const Dropdown = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 160px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.blueWhite.bg8};
  backdrop-filter: blur(25px);
  border: 1px solid ${({ theme }) => theme.colors.blueWhite.border10};
  border-radius: 16px;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

export const Item = styled.button<{ variant?: 'default' | 'danger' }>`
  ${({ theme }) => theme.typography.body15Medium}
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.status.red[200] : theme.colors.gray[200]};
  cursor: pointer;
  white-space: nowrap;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.blueWhite.bg20};
  }
`;
