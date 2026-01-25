import styled from '@emotion/styled';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #242426;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  flex: 1;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PhotoPreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: #1a1a1c;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #b2b2b4;
`;

export const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #1a1a1c;
  border-radius: 12px;
`;

export const LocationIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8e;
`;

export const LocationText = styled.span`
  font-size: 16px;
  color: #ffffff;
  flex: 1;
`;

export const LocationPlaceholder = styled.span`
  font-size: 16px;
  color: #8c8c8e;
`;

export const LocationButton = styled.button`
  padding: 8px 16px;
  background-color: #3a3a3c;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export const AlbumSelector = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #1a1a1c;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export const AlbumText = styled.span`
  font-size: 16px;
  color: #8c8c8e;
`;

export const ChevronIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8e;
`;

export const BottomSection = styled.div`
  padding: 20px;
  padding-bottom: 40px;
`;
