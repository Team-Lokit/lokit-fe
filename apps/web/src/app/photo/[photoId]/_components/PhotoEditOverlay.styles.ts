import styled from '@emotion/styled';
import LocationArrowSvg from '@/assets/images/locationArrow.svg';
import { motion } from 'framer-motion';

const TOOLTIP_GAP = 8;
const TOOLTIP_ARROW_OFFSET = 5;

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: 100dvh;
  background-color: ${({ theme }) => theme.colors.blackOpacity[100]};
  overflow: hidden;
`;

export const PhotoSection = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 20px;
`;

export const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.blackOpacity[100]};
`;

export const PhotoBlurBackground = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.08);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #00000033;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
  }
`;
export const PhotoMain = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    pointer-events: none;
  }
`;

export const TopOverlay = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  box-sizing: border-box;
`;

export const MemoAlbumOverlay = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  padding: 24px 16px 16px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.gradient.black2};
`;

export const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: auto;
`;

export const LocationChipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

export const LocationTooltipPositioner = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: calc(100% + ${TOOLTIP_GAP + TOOLTIP_ARROW_OFFSET}px);
  z-index: 10;

  width: max-content;
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: end;
  padding: 12px 16px 57px;
  background-color: ${({ theme }) => theme.colors.blackOpacity[100]};
`;

export const TooltipWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

export const Tooltip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.grayScale[900]};
  border-radius: 99px;
  backdrop-filter: blur(5px);

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.colors.grayScale[900]};
    border-radius: 2px;
  }
`;

export const TooltipIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TooltipText = styled.span`
  ${({ theme }) => theme.typography.body14Semibold};
  color: ${({ theme }) => theme.colors.grayScale[0]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;

export const TooltipButton = styled.button`
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.grayScale[400]};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export const MemoButton = styled.button`
  ${({ theme }) => theme.typography.body14Medium};
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.grayScale[100]};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  white-space: pre-wrap;

  &:active {
    opacity: 0.8;
  }
`;

export const AlbumButtonWrapper = styled.div`
  display: flex;
`;

export const ChipIconWrapper = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const LocationArrowIcon = styled(LocationArrowSvg)`
  width: 12px;
  height: 12px;
  display: block;
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;
export const AlbumIconWrapper = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const AlbumButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.colors.grayScale[900]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  border-radius: 8px;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.grayScale[800]};
  }
`;

export const AlbumIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const AlbumText = styled.span`
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;

export const AlbumResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MapPreviewButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.grayScale[900]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhiteOpacity.border10};
  border-radius: 999px;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.grayScale[800]};
  }
`;

export const MapIcon = styled.div`
  width: 16px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayScale[400]};
`;

export const MapPreviewText = styled.span`
  ${({ theme }) => theme.typography.body16Semibold};
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;

export const SaveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.gradient.mint};
  border: none;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.gradient.mintHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayScale[700]};
    cursor: not-allowed;
  }
`;

export const SaveIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
