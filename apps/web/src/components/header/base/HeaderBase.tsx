import { ReactNode } from 'react';
import * as S from './Header.styles';

export type HeaderBackground = 'default' | 'transparent' | 'dim';

export interface HeaderBaseProps {
  /** 왼쪽 영역 */
  left?: ReactNode;
  /** 중앙 영역 */
  center?: ReactNode;
  /** 오른쪽 영역 */
  right?: ReactNode;
  /**
   * 배경
   * - default: 옅은 검정 그라데이션
   * - transparent: 투명
   * - dim: 진한 검정 그라데이션
   */
  background?: HeaderBackground;
  /** 화면 상단에 고정 여부 (고정 시 배경은 항상 불투명 검정) */
  fixed?: boolean;
}

const HeaderBase = ({
  left,
  center,
  right,
  background = 'default',
  fixed,
}: HeaderBaseProps) => {
  return (
    <S.Container $background={background} fixed={fixed}>
      <S.LeftSection>{left}</S.LeftSection>
      <S.CenterSection>{center}</S.CenterSection>
      <S.RightSection>{right}</S.RightSection>
    </S.Container>
  );
};

export default HeaderBase;
