import { ReactNode } from 'react';
import * as S from './Header.styles';

export interface HeaderBaseProps {
  /** 왼쪽 영역 */
  left?: ReactNode;
  /** 중앙 영역 */
  center?: ReactNode;
  /** 오른쪽 영역 */
  right?: ReactNode;
  /** 투명 배경 여부 */
  transparent?: boolean;
  /** 화면 상단에 고정 여부 (고정 시 배경은 항상 불투명 검정) */
  fixed?: boolean;
}

const HeaderBase = ({ left, center, right, transparent, fixed }: HeaderBaseProps) => {
  return (
    <S.Container transparent={transparent} fixed={fixed}>
      <S.LeftSection>{left}</S.LeftSection>
      <S.CenterSection>{center}</S.CenterSection>
      <S.RightSection>{right}</S.RightSection>
    </S.Container>
  );
};

export default HeaderBase;
