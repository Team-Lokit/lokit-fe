import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 119px;
  gap: 12px;

  color: ${({ theme }) => theme.colors.grayScale[600]};

  svg {
    width: 40px;
    height: 40px;
  }
`;

export const Text = styled.span`
  ${({ theme }) => theme.typography.body15Regular}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;
