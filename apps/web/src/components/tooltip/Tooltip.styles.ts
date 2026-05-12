import styled from '@emotion/styled';

type TooltipArrowPosition = 'top' | 'bottom';
type TooltipArrowAlign = 'left' | 'center' | 'right';

interface TooltipStyleProps {
  $arrowPosition?: TooltipArrowPosition;
  $arrowAlign?: TooltipArrowAlign;
}

const getArrowAlignStyle = (align: TooltipArrowAlign = 'center') => {
  switch (align) {
    case 'left':
      return `
        left: 24px;
        transform: rotate(45deg);
      `;
    case 'right':
      return `
        right: 24px;
        transform: rotate(45deg);
      `;
    case 'center':
    default:
      return `
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      `;
  }
};

const getArrowPositionStyle = (position: TooltipArrowPosition = 'top') => {
  switch (position) {
    case 'bottom':
      return `
        bottom: -5px;
      `;
    case 'top':
    default:
      return `
        top: -5px;
      `;
  }
};

export const TooltipWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

export const Tooltip = styled.div<TooltipStyleProps>`
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
    ${({ $arrowPosition }) => getArrowPositionStyle($arrowPosition)}
    ${({ $arrowAlign }) => getArrowAlignStyle($arrowAlign)}

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

  svg {
    display: block;
  }
`;

export const TooltipText = styled.span`
  ${({ theme }) => theme.typography.body14Semibold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
  line-height: 1;
`;

export const TooltipButton = styled.button`
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.grayScale[400]};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 1;

  &:active {
    opacity: 0.8;
  }
`;
