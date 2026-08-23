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
  width: min(calc(100% - 24px), calc(${({ theme }) => theme.layout.maxWidth} - 24px));
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
  width: 100%;
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
  flex: 1;
  color: ${({ theme }) => theme.colors.grayScale[0]};
  opacity: 0.9;
  white-space: nowrap;
`;

export const ToastAction = styled.button`
  ${({ theme }) => theme.typography.body14Semibold};
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.grayScale[400]};
  white-space: nowrap;
  cursor: pointer;
`;
