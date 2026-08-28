import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.blackOpacity[100]};
`;

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0 16px;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.body14Medium}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;
