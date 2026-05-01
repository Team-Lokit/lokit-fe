import styled from '@emotion/styled';

export const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};

  z-index: ${({ theme }) => theme.zIndex.popupRoot};

  isolation: isolate;
  pointer-events: none;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
`;

export const Layer = styled.div`
  position: absolute;
  inset: 0;

  pointer-events: auto;

  display: flex;

  align-items: center;
  justify-content: center;
`;
