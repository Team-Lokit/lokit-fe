import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

const variantStyles = {
  checked: (theme: Theme) => css`
    background: ${theme.colors.grayScale[100]};
  `,
  unchecked: (theme: Theme) => css`
    background: ${theme.colors.blueWhiteOpacity.bg20};
  `,
};

export const Wrapper = styled.label<{ checked: boolean; disabled?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s ease;

  ${({ checked, theme }) =>
    checked ? variantStyles.checked(theme) : variantStyles.unchecked(theme)}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

export const InputContainer = styled.input`
  display: none;
`;

export const Thumb = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 4px;
  left: ${({ checked }) => (checked ? '24px' : '4px')};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.blackOpacity[100]};
  transition: left 0.2s ease;
`;
