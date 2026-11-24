import { type KeyboardEvent, type ReactNode } from 'react';
import { ChipSize, ChipVariant } from '@/types/button.type';
import * as S from './Chip.styles';

interface ChipProps {
  /** Chip 텍스트 */
  text: string;
  /** Chip variant */
  variant?: ChipVariant;
  /** Chip 사이즈 */
  size: ChipSize;
  /** 좌측 아이콘 표시 여부 (기본 LocationIcon) */
  showIcon?: boolean;
  /** 커스텀 좌측 아이콘 */
  icon?: ReactNode;
  /** 우측 아이콘 (예: 화살표). onCancel이 있으면 취소 아이콘이 우선 */
  trailingIcon?: ReactNode;
  /** 텍스트만으로 동작이 드러나지 않을 때 스크린리더용 이름 */
  ariaLabel?: string;
  /** 클릭 이벤트 */
  onClick?: () => void;
  /** 제거 버튼 표시 여부 */
  onCancel?: () => void;
}

const Chip = ({
  text,
  variant = 'black',
  size,
  showIcon = false,
  icon,
  trailingIcon,
  ariaLabel,
  onClick,
  onCancel,
}: ChipProps) => {
  const isClickable = !!onClick;

  // 클릭 가능한 칩은 키보드(Enter/Space)로도 누를 수 있게 한다
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <S.Wrapper
      size={size}
      variant={variant}
      onClick={onClick}
      $clickable={isClickable}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      {icon ? <S.IconWrapper>{icon}</S.IconWrapper> : showIcon && <S.LocationIcon />}
      {text}
      {onCancel ? (
        <S.IconButton onClick={onCancel}>
          <S.CancelIcon />
        </S.IconButton>
      ) : (
        trailingIcon && <S.IconWrapper aria-hidden>{trailingIcon}</S.IconWrapper>
      )}
    </S.Wrapper>
  );
};

export default Chip;
