import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
`;

export const ToastItem = styled.div<{
  isExiting?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  animation: ${({ isExiting }) => (isExiting ? slideDown : slideUp)} 0.3s ease;
  pointer-events: auto;

  background: ${({ theme }) => theme.colors.grayScale[900]};
`;

export const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ToastText = styled.span`
  ${({ theme }) => theme.typography.body14Semibold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
  white-space: nowrap;
`;
