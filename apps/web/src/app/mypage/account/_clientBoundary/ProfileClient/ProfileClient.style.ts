import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.blueWhite['bg5']};
`;
