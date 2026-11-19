'use client';

import { useRouter } from 'next/navigation';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import ChevronLeftSvg from '@/assets/images/chevronLeft.svg';
import * as S from './BackHeader.styles';

export interface BackHeaderProps {
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
}

/** 뒤로가기 버튼만 있는 헤더 */
const BackHeader = ({ showBackButton = true }: BackHeaderProps) => {
  const router = useRouter();

  return (
    <S.Header>
      {showBackButton && (
        <CircleButton onClick={() => router.back()} aria-label="뒤로가기">
          <ChevronLeftSvg />
        </CircleButton>
      )}
    </S.Header>
  );
};

export default BackHeader;
