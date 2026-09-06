import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.span`
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;

export const Description = styled.span`
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[300]};
`;
