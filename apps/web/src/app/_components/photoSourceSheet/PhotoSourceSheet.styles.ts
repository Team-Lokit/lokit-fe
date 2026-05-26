import styled from '@emotion/styled';

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading18Bold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
