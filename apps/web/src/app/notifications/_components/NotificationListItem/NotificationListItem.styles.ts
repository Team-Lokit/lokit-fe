import styled from '@emotion/styled';

export const Row = styled.button<{ isRead: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;

  ${({ isRead, theme }) =>
    !isRead && `background-color: ${theme.colors.blueWhiteOpacity.bg8};`}
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  padding: 6px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.span`
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const Time = styled(Title)`
  flex-shrink: 0;
  margin-left: auto;
`;

export const Body = styled.span`
  ${({ theme }) => theme.typography.body16Regular}
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;
