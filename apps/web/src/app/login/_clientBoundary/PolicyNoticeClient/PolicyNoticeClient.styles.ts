import styled from '@emotion/styled';

export const InfoText = styled.p`
  ${({ theme }) => theme.typography.caption12Regular}
  color: ${({ theme }) => theme.colors.grayScale[600]};
  text-align: center;
  align-items: stretch;
`;

export const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.grayScale[600]};

  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  cursor: pointer;
`;
