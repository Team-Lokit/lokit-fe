import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { HEADER_PADDING } from './Header.constants';
import type { HeaderBackground } from './HeaderBase';

const BACKGROUNDS: Record<HeaderBackground, (theme: Theme) => string> = {
  default: (theme) => theme.colors.gradient.black1,
  transparent: () => 'transparent',
  dim: () => 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)',
};

export const Container = styled.header<{
  $background: HeaderBackground;
  fixed?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: ${HEADER_PADDING};
  background: ${({ theme, $background, fixed }) =>
    fixed ? theme.colors.blackOpacity[100] : BACKGROUNDS[$background](theme)};

  ${({ fixed, theme }) =>
    fixed &&
    `
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      max-width: ${theme.layout.maxWidth};
      z-index: 10;
    `}
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 60px;
  flex-shrink: 0;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  overflow: hidden;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 60px;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.grayScale[0]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;
