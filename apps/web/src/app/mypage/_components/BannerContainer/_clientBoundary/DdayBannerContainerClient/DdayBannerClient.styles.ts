import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 82px;
  overflow: hidden;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid rgba(226, 230, 255, 0.1);
  background: ${({ theme }) => theme.colors.blueWhite.bg5};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  cursor: pointer;
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const CalendarContainer = styled.div`
  padding: 6px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.blueWhite['bg8']};
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
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

export const Title = styled.span`
  ${({ theme }) => theme.typography.body16Semibold}
  color: ${({ theme }) => theme.colors.gray[200]};
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body14Medium}
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const ChevronIcon = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[200]};
`;
