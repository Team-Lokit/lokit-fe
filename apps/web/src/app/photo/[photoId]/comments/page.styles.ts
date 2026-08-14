import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.grayScale[1000]};
`;

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.body14Medium}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;
