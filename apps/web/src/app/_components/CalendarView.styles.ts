import styled from '@emotion/styled';

/** 하단 뷰 스위처(bottom 40px, 높이 44px) 위로 16px 띄운 위치 */
export const TodayButtonWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: calc(40px + 44px + 16px);
  transform: translateX(-50%);
  z-index: 999;
`;
