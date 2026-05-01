import styled from '@emotion/styled';

export const Wrapper = styled.div<{ $backgroundImage?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 12px;
  height: 81px;
  overflow: hidden;
  border: 1px solid rgba(226, 230, 255, 0.1);
  background: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url("${$backgroundImage}") center / cover no-repeat`
      : 'rgba(226, 230, 255, 0.05)'};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  cursor: pointer;
`;

export const BackgroundIcon = styled.div`
  position: absolute;
  right: -10px;
  bottom: -60px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 4px;
`;

export const Caption = styled.span`
  ${({ theme }) => theme.typography.caption12Regular}
  color: ${({ theme }) => theme.colors.gray[100]};
`;

export const CountRow = styled.span`
  ${({ theme }) => theme.typography.heading24Bold}
  color: ${({ theme }) => theme.colors.gray[0]};
`;

export const EmptyCaption = styled.span`
  ${({ theme }) => theme.typography.caption12Regular}
  color: ${({ theme }) => theme.colors.gray[300]};
`;

export const EmptyText = styled.span`
  ${({ theme }) => theme.typography.body18Semibold}
  color: ${({ theme }) => theme.colors.gray[300]};
`;

export const ChevronIcon = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[200]};
`;
