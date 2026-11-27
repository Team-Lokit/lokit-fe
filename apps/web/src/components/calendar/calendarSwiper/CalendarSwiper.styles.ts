import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

/** 한 달 너비만 보이도록 잘라내는 영역 */
export const Viewport = styled.div`
  width: 100%;
  overflow: hidden;
`;

/** [이전 | 현재 | 다음] 세 달을 가로로 나란히 둔 트랙. 가운데(현재 달)가 보이도록 한 칸 왼쪽으로 당겨둔다. */
export const Track = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  /* 너비를 고정하지 않으면 음수 margin만큼 트랙이 넓어져 패널 너비가 어긋난다 */
  width: 100%;
  margin-left: -100%;
`;

export const Panel = styled.div`
  flex: 0 0 100%;
  min-width: 0;
`;
