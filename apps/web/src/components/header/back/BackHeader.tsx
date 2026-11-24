'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftSvg from '@/assets/images/chevronLeft.svg';
import HeaderBase from '../base/HeaderBase';
import HeaderIconButton from '../base/HeaderIconButton';

export interface BackHeaderProps {
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
}

/** 뒤로가기 버튼만 있는 헤더 */
const BackHeader = ({ showBackButton = true }: BackHeaderProps) => {
  const router = useRouter();

  return (
    <HeaderBase
      background="transparent"
      left={
        showBackButton && (
          <HeaderIconButton
            icon={ChevronLeftSvg}
            onClick={() => router.back()}
            aria-label="뒤로가기"
          />
        )
      }
    />
  );
};

export default BackHeader;
