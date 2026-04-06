import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 81px;
  overflow: hidden;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(226, 230, 255, 0.1);
  background: ${({ theme }) => theme.colors.blueWhite.bg5};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  cursor: pointer;
`;

export const BackgroundIcon = styled.div`
  position: absolute;
  right: 15px;
  bottom: -30px;
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
  color: ${({ theme }) => theme.colors.gray[200]};
`;

export const DdayRow = styled.span`
  ${({ theme }) => theme.typography.heading24Bold}
  display: flex;
  gap: 2px;
`;

export const DdayPrefix = styled.span`
  color: ${({ theme }) => theme.colors.gray[300]};
`;

export const DdayNumber = styled.span`
  color: ${({ theme }) => theme.colors.gray[0]};
`;

export const EmptyText = styled.span`
  ${({ theme }) => theme.typography.body18Semibold}
  color: ${({ theme }) => theme.colors.gray[300]};
  padding: 4px;
`;

export const ChevronIcon = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[200]};
`;
