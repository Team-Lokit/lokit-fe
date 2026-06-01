import styled from '@emotion/styled';

export const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.blackOpacity[50]};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[25]};
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;
