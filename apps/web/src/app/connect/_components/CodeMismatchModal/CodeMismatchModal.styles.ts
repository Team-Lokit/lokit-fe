import styled from '@emotion/styled';

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  text-align: center;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading18Bold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
  margin: 0;
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body15Regular};
  color: ${({ theme }) => theme.colors.grayScale[500]};
  margin: 0;
`;
