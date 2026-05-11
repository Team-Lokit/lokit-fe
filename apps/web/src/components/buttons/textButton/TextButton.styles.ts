import { TextButtonSize, TextButtonVariant } from '@/types/button.type';
import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

const variantStyles = {
  default: (theme: Theme) => css`
    color: ${theme.colors.text.primary};
  `,
  primary: (theme: Theme) => css`
    color: ${theme.colors.primary[400]};
  `,
  negative: (theme: Theme) => css`
    color: ${theme.colors.status.red[200]};
  `,
};

const sizeStyles = {
  small: (theme: Theme) => css`
    ${theme.typography.body15Medium}
    padding: 6px 12px;
    border-radius: 8px;
  `,
  medium: (theme: Theme) => css`
    ${theme.typography.body16Semibold}
    padding: 12px 16px;
    border-radius: 12px;
  `,
};
export const Wrapper = styled.button<{
  size: TextButtonSize;
  variant: TextButtonVariant;
  disabled?: boolean;
  textAlign: 'left' | 'center';
}>`
  ${({ size, theme }) => sizeStyles[size](theme)}
  ${({ variant, theme }) => variantStyles[variant](theme)}
  text-align: ${({ textAlign }) => textAlign};

  &:disabled {
    color: ${({ theme }) => theme.colors.grayScale[600]};
    cursor: not-allowed;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg8};
  }

  &:active {
    background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg8};
  }
`;
