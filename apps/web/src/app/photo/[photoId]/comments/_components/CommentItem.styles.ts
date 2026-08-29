import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0 20px;
`;

export const ProfileImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grayScale[700]};
  object-fit: cover;
  flex-shrink: 0;
`;

export const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const ReactionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Name = styled.span`
  ${({ theme }) => theme.typography.body15Semibold}
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const Dot = styled.span`
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const Date = styled.span`
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const Content = styled.p`
  ${({ theme }) => theme.typography.body15Regular}
  color: ${({ theme }) => theme.colors.grayScale[100]};
  text-shadow: ${({ theme }) => theme.effects.shadow.center};
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ReactionChip = styled.button<{ $reacted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 99px;
  border: 1px solid
    ${({ theme, $reacted }) =>
      $reacted ? theme.colors.primary[400] : theme.colors.blueWhiteOpacity.border10};
  background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg5};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[5]};
  cursor: pointer;
  ${({ theme }) => theme.typography.caption12Semibold}
  color: ${({ theme, $reacted }) =>
    $reacted ? theme.colors.primary[100] : theme.colors.grayScale[200]};

  &:active {
    opacity: 0.8;
  }
`;

export const UtilityChip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 28px;
  padding: 4px 8px;
  border-radius: 99px;
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg5};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[5]};
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.grayScale[400]};
  cursor: pointer;

  svg {
    display: block;
  }

  &:active {
    opacity: 0.7;
  }
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1009;
`;

export const MenuDropdown = styled.div`
  position: fixed;
  z-index: 1010;
  width: max-content;
`;
