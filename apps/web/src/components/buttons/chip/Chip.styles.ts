import { ChipSize, ChipVariant } from '@/types/button.type';
import { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import LocationSvg from '@/assets/images/location.svg';
import CancelSvg from '@/assets/images/cancel.svg';

const variantStyles = {
  black: (theme: Theme) => css`
    background: ${theme.colors.blackOpacity[20]};
    color: ${theme.colors.text.primary};
    backdrop-filter: ${theme.effects.backdropBlur[25]};
    -webkit-backdrop-filter: ${theme.effects.backdropBlur[25]};
  `,
};

const sizeStyles = {
  small: (theme: Theme) => css`
    ${theme.typography.caption12Semibold}
    padding: 6px 10px;
    gap: 4px;
  `,
  medium: (theme: Theme) => css`
    ${theme.typography.body15Semibold}
    padding: 6px 14px;
    gap: 6px;
  `,
};

export const Wrapper = styled.div<{
  variant: ChipVariant;
  size: ChipSize;
  $clickable?: boolean;
}>`
  display: flex;
  width: fit-content;
  flex-direction: row;
  align-items: center;
  ${({ variant, theme }) => variantStyles[variant](theme)}
  ${({ size, theme }) => sizeStyles[size](theme)}
  border-radius: 99px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const LocationIcon = styled(LocationSvg)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const CancelIcon = styled(CancelSvg)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
