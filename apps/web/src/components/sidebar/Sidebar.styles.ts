import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const Backdrop = styled.div<{ $isOpen: boolean; $isClosing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay - 1};
  background: rgba(0, 0, 0, 0.4);
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s ease forwards;
  ${({ $isOpen, $isClosing }) => !$isOpen && !$isClosing && 'display: none;'}
`;

export const Container = styled.aside<{ $isOpen: boolean; $isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ theme }) => theme.layout.sidebarWidth};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray.a80};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  border-right: 1px solid ${({ theme }) => theme.colors.blueWhite.border10};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  flex-direction: column;
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease forwards;
  ${({ $isOpen, $isClosing }) => !$isOpen && !$isClosing && 'display: none;'}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow: hidden;
  padding-top: 48px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px;
`;

export const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.blueWhite.border10};
  padding: 8px;
  margin-bottom: 20px;
`;
