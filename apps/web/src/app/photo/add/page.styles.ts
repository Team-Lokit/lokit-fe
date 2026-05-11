import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.grayScale[1000]};
`;

export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

/** 사진 추가 버튼 */
export const AddPhotoButton = styled.button`
  aspect-ratio: 118 / 157;
  border: none;
  background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.bg8};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayScale[400]};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.bg5};
  }
`;

/** 로딩 */
export const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ theme }) => theme.typography.body14Regular}
`;
