import styled from '@emotion/styled';

const BOTTOM_FLOATING_OFFSET = '40px';

export const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  position: relative;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 1010;
`;

export const FloatingButtonWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 54px;
  transform: translateX(-50%);
  z-index: 999;
`;

export const ActionColumn = styled.div`
  position: absolute;
  right: 12px;
  bottom: ${BOTTOM_FLOATING_OFFSET};
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1001;
`;

export const GridViewContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-top: 106px;
`;

export const CalendarViewContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-top: 106px;
  /* 6주짜리 달에서도 마지막 주가 하단 뷰 스위처에 가리지 않도록 */
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.blackOpacity[100]};
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
`;

export const ViewSwitcherWrapper = styled.div`
  position: absolute;
  bottom: ${BOTTOM_FLOATING_OFFSET};
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
`;
