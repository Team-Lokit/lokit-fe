import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading24Bold}
  color: ${({ theme }) => theme.colors.grayScale[100]};
  text-align: center;
`;

export const MainText = styled.span`
  background: var(--Gradient-mint, linear-gradient(180deg, #d5fffd 0%, #6eeae4 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
