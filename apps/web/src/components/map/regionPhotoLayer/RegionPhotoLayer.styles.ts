import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 0;
`;

export const RegionGroup = styled.g`
  animation: ${fadeIn} 0.25s ease-out;
`;

/** 사진 로딩 전, 사진 기준 사각형 밖(작은 섬 등)을 채우는 배경 */
export const Placeholder = styled.path`
  fill: #e9e9ec;
`;

/**
 * 경계 테두리: 어두운 외곽선(OutlineHalo) 위에 흰 선(Outline)을 겹쳐 그린다.
 * 밝은 지도 배경과 어두운 사진 어느 쪽에서도 경계가 보이게 하기 위함
 */
export const OutlineHalo = styled.path`
  fill: none;
  stroke: rgba(0, 0, 0, 0.2);
  stroke-width: 3px;
  stroke-linejoin: round;
  animation: ${fadeIn} 0.25s ease-out;
`;

export const Outline = styled.path`
  fill: none;
  stroke: #ffffff;
  stroke-width: 1.5px;
  stroke-linejoin: round;
  animation: ${fadeIn} 0.25s ease-out;
`;
