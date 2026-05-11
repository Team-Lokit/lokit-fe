import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

const variantStyles = {
  checked: (theme: Theme) => css`
    background: ${theme.colors.grayScale[0]};
    border: none;
  `,
  unchecked: (theme: Theme) => css`
    background-color: ${theme.colors.blueWhiteOpacity['bg5']};
    border: 2px solid ${theme.colors.blueWhiteOpacity['bg5']};
  `,
};

export const Wrapper = styled.label<{ checked: boolean }>`
  border-radius: 4px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ checked, theme }) =>
    checked ? variantStyles.checked(theme) : variantStyles.unchecked(theme)}
`;

export const InputContainer = styled.input`
  display: none;
`;
