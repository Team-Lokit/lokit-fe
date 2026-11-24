import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;

export const Input = styled.input<{ isFilled: boolean }>`
  flex: 1;
  min-width: 0;
  height: 56px;
  ${({ theme }) => theme.typography.body18Semibold};
  text-align: center;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
  background-color: ${({ theme, isFilled }) =>
    isFilled ? theme.colors.blueWhiteOpacity.bg20 : theme.colors.blueWhiteOpacity.bg5};
  transition:
    border-color 0.2s,
    background-color 0.2s;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.grayScale[100]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;
