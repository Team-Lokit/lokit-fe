import { ReactNode } from 'react';
import * as S from './Tooltip.styles';

import SuccessIcon from '@/assets/images/success.svg';
import WarningIcon from '@/assets/images/warning.svg';
import InfoIcon from '@/assets/images/info.svg';
import CloseIcon from '@/assets/images/closeSmall.svg';

type TooltipStatusType = 'success' | 'error' | 'info';
type TooltipArrowPosition = 'top' | 'bottom';
type TooltipArrowAlign = 'left' | 'center' | 'right';

interface TooltipProps {
  status: TooltipStatusType;
  arrowPosition?: TooltipArrowPosition;
  arrowAlign?: TooltipArrowAlign;
  icon?: ReactNode;
  showClose?: boolean;
  tooltipText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onClose?: () => void;
}

const STATUS_ICON = {
  success: <SuccessIcon width={14} height={14} />,
  error: <WarningIcon width={14} height={14} />,
  info: <InfoIcon width={14} height={14} />,
};

export default function Tooltip({
  status,
  arrowPosition = 'top',
  arrowAlign = 'center',
  icon,
  showClose = false,
  tooltipText = '툴팁 텍스트',
  buttonText,
  onButtonClick,
  onClose,
}: TooltipProps) {
  return (
    <S.TooltipWrapper>
      <S.Tooltip $arrowPosition={arrowPosition} $arrowAlign={arrowAlign}>
        <S.TooltipIcon>{icon ?? STATUS_ICON[status]}</S.TooltipIcon>

        <S.TooltipText>{tooltipText}</S.TooltipText>

        {buttonText && (
          <S.TooltipButton type="button" onClick={onButtonClick}>
            {buttonText}
          </S.TooltipButton>
        )}

        {showClose && (
          <S.TooltipCloseIcon>
            <CloseIcon
              width={14}
              height={14}
              onClick={onClose}
              aria-label="툴팁 닫기"
              cursor="pointer"
            />
          </S.TooltipCloseIcon>
        )}
      </S.Tooltip>
    </S.TooltipWrapper>
  );
}
