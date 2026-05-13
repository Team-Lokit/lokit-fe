import styled from '@emotion/styled';
import { MenuItemVariant, MenuSize } from './Menu';

export const Wrapper = styled.div<{ $size: MenuSize }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  padding: 8px;

  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[25]};
  background: ${({ theme }) => theme.colors.blackOpacity[50]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity['border10']};

  border-radius: ${({ $size }) => ($size === 'md' ? '20px' : '16px')};
`;

export const Item = styled.button<{
  $size: MenuSize;
  $variant: MenuItemVariant;
}>`
  width: 100%;
  border: 0;
  background: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: transparent;

  border-radius: ${({ $size }) => ($size === 'md' ? '12px' : '8px')};

  padding: ${({ $size }) => ($size === 'md' ? '12px 16px' : '6px 12px')};

  ${({ theme, $size }) =>
    $size === 'md' ? theme.typography.body16Semibold : theme.typography.body15Medium};

  color: ${({ theme, $variant }) =>
    $variant === 'danger' ? theme.colors.status.red[200] : theme.colors.grayScale[200]};

  &:hover {
    background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg20};
  }
`;
