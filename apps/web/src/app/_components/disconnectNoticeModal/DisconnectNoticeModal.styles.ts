import styled from '@emotion/styled';

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.grayScale[100]};
  text-align: center;
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body16Regular}
  color: ${({ theme }) => theme.colors.grayScale[500]};
  margin-bottom: 12px;
  text-align: center;
  word-break: keep-all;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;

  button {
    flex: 1;
  }
`;
