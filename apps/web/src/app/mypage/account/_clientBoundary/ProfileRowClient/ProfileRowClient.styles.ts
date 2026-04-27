import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const RowTitle = styled.span`
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const RowValue = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  ${({ theme }) => theme.typography.body16Semibold}
  color: ${({ theme }) => theme.colors.gray[200]};
`;
