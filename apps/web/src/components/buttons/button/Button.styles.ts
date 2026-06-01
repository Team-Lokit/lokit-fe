import { ButtonSize, ButtonVariant } from '@/types/button.type';
import { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const variantStyles = {
  highlight: (theme: Theme) => css`
    background: ${theme.colors.gradient.mint};
    color: ${theme.colors.grayScale[1000]};

    &:hover:not(:disabled) {
      background: ${theme.colors.gradient.mintHover};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.gradient.mintHover};
    }

    &:disabled {
      color: ${theme.colors.grayScale[600]};
      background: ${theme.colors.grayScale[700]};
      cursor: not-allowed;
    }
  `,

  primary: (theme: Theme) => css`
    background: ${theme.colors.grayScale[0]};
    color: ${theme.colors.grayScale[1000]};

    &:hover:not(:disabled) {
      background: ${theme.colors.grayScale[100]};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.grayScale[100]};
    }

    &:disabled {
      color: ${theme.colors.grayScale[600]};
      background: ${theme.colors.grayScale[700]};
      cursor: not-allowed;
    }
  `,

  secondary: (theme: Theme) => css`
    background: ${theme.colors.grayScale[900]};
    color: ${theme.colors.grayScale[100]};

    &:hover:not(:disabled) {
      background: ${theme.colors.grayScale[800]};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.grayScale[800]};
    }

    &:disabled {
      background: ${theme.colors.grayScale[700]};
      color: ${theme.colors.grayScale[600]};
      cursor: not-allowed;
    }
  `,

  danger: (theme: Theme) => css`
    background: ${theme.colors.status.red[200]};
    color: ${theme.colors.grayScale[0]};

    &:hover:not(:disabled) {
      background: ${theme.colors.status.red[300]};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.status.red[300]};
    }

    &:disabled {
      background: ${theme.colors.grayScale[700]};
      color: ${theme.colors.grayScale[600]};
      cursor: not-allowed;
    }
  `,
};

const sizeStyles = {
  small: (theme: Theme) => css`
    ${theme.typography.button14Bold}
    padding: 7px 12px;
    border-radius: 8px;
  `,
  medium: (theme: Theme) => css`
    ${theme.typography.button14Bold}
    padding: 10px 16px;
    border-radius: 8px;
  `,
  large: (theme: Theme) => css`
    ${theme.typography.body16Semibold}
    padding: 12px 16px;
    border-radius: 12px;
  `,
};

export const Button = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
}>`
  ${({ variant, theme }) => variantStyles[variant](theme)}
  ${({ size, theme }) => sizeStyles[size](theme)}
`;
