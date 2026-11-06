import styled from '@emotion/styled';

const ROW_PADDING_X = '8px';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MonthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 8px 24px;
  border: none;
  background: none;
  cursor: pointer;
`;

export const MonthLabel = styled.span`
  ${({ theme }) => theme.typography.body14Semibold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
  text-shadow: 0 0 6px ${({ theme }) => theme.colors.blackOpacity[50]};
`;

export const MonthIcon = styled.span`
  display: flex;
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.grayScale[500]};
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  padding: 0 ${ROW_PADDING_X};
  border-bottom: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
`;

export const WeekdayRow = styled(WeekGrid)`
  height: 32px;
  align-items: center;
  ${({ theme }) => theme.typography.caption12Regular};
  color: ${({ theme }) => theme.colors.grayScale[400]};
  text-align: center;
`;

export const WeekRow = styled(WeekGrid)`
  height: 112px;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const DayCell = styled.div<{ $isCurrentMonth: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 0;
  padding: 0 2px;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.3)};
`;

export const DayButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export type DayVariant = 'default' | 'today' | 'weekend';

export const DayNumber = styled.span<{ $variant: DayVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 8px;
    ${({ theme, $variant }) =>
      $variant === 'today'
        ? `
          background-color: ${theme.colors.grayScale[0]};
          color: ${theme.colors.grayScale[1000]};
        `
        : `
          color: ${$variant === 'weekend' ? theme.colors.status.red[300] : theme.colors.grayScale[500]};
        `}
    ${({ theme, $variant }) =>
      $variant === 'today'
        ? theme.typography.caption12Semibold
        : theme.typography.caption12Regular};
  }
`;

/**
 * Figma(360px 기준)의 셀 콘텐츠 너비(45px)로 고정.
 * 화면이 넓어져도 썸네일·배지가 가로로 늘어나지 않도록 max-width로 제한한다.
 */
const DAY_CONTENT_MAX_WIDTH = '45px';

export const DayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: ${DAY_CONTENT_MAX_WIDTH};
`;

export const AnniversaryBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  ${({ theme }) => theme.typography.caption11Bold};
  color: ${({ theme }) => theme.colors.grayScale[200]};
  white-space: nowrap;
  overflow: hidden;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.bg20};
`;
