import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: sticky;
  bottom: 0;
  padding: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: ${({ theme }) => theme.colors.grayScale[1000]};
`;

export const Bar = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 8px;
  border-radius: 26px;
  background: ${({ theme }) => theme.colors.grayScale[1000]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
`;

export const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grayScale[700]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  object-fit: cover;
  flex-shrink: 0;
`;

export const ProfileFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  flex-shrink: 0;
`;

export const Textarea = styled.textarea`
  flex: 1;
  min-height: 24px;
  max-height: 96px;
  resize: none;
  border: none;
  background: transparent;
  outline: none;
  padding: 6px 0;
  ${({ theme }) => theme.typography.body16Regular}
  color: ${({ theme }) => theme.colors.grayScale[100]};

  &::placeholder {
    color: ${({ theme }) => theme.colors.grayScale[400]};
  }
`;

export const SendButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  flex-shrink: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.gradient.mint};
  border: none;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.gradient.mintHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayScale[600]};
    cursor: not-allowed;
  }
`;

export const SendIcon = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[1000]};
`;
