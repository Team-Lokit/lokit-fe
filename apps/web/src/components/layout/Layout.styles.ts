import styled from '@emotion/styled';

export const Container = styled.main`
  position: relative;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100%;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.blackOpacity[100]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
