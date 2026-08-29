import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1009;
  background: ${({ theme }) => theme.colors.blackOpacity[50]};
`;

export const SheetWrapper = styled.div`
  position: fixed;
  z-index: 1010;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #262627;
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  border-bottom: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
`;

export const HandleBar = styled.div`
  width: 100%;
  height: 28px;
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  .handle {
    width: 44px;
    height: 4px;
    background-color: #636364;
    border-radius: 10px;
  }
`;

export const PickerWrapper = styled.div`
  --epr-dark-bg-color: #262627;
  --epr-dark-text-color: ${({ theme }) => theme.colors.grayScale[100]};
  --epr-dark-picker-border-color: transparent;
  --epr-dark-category-label-bg-color: #262627;
  --epr-dark-category-icon-active-color: ${({ theme }) => theme.colors.primary[400]};
  --epr-dark-search-input-bg-color: #262627;
  --epr-dark-search-input-bg-color-active: #262627;
  --epr-search-border-color: ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  --epr-search-border-color-active: ${({ theme }) => theme.colors.primary[400]};
  --epr-dark-hover-bg-color: ${({ theme }) => theme.colors.blueWhiteOpacity.bg20};
  --epr-dark-highlight-color: ${({ theme }) => theme.colors.primary[400]};

  .EmojiPickerReact.epr-dark-theme {
    width: 100%;
    height: 100%;
    border: none;
  }
`;
