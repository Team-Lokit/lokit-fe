import styled from '@emotion/styled';

export const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: #242426;
`;

export const SrOnly = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const ContentLayout = styled.div`
  padding: 16px;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  height: 108px;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.blueWhite['bg5']};
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }

  p {
    margin: 0;
  }
`;

export const ButtonText = styled.p`
  flex: 1;
  min-width: 0;
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.gray[200]};
  text-align: left;
`;

export const ChevronIcon = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray[400]};

  svg {
    width: 16px;
    height: 16px;
    display: block;
    overflow: visible;
  }
`;
