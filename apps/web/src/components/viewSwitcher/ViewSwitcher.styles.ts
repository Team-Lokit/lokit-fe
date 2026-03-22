import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 4px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  border: 1px solid ${({ theme }) => theme.colors.blueWhite.border10};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[25]};
`;

export const Tab = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
  padding: 8px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  ${({ $isActive, theme }) =>
    $isActive
      ? `
        background-color: ${theme.colors.gray[100]};
        backdrop-filter: ${theme.effects.backdropBlur[25]};
      `
      : `
        background: none;
        width: 36px;
        padding: 8px;
      `}
`;

export const TabIcon = styled.div<{ $isActive: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.gray[900] : theme.colors.gray[100]};
`;

export const TabLabel = styled.span`
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
