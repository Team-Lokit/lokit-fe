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
}

const HeaderBase = ({ left, center, right, transparent }: HeaderBaseProps) => {
  return (
    <S.Container transparent={transparent}>
      <S.LeftSection>{left}</S.LeftSection>
      <S.CenterSection>{center}</S.CenterSection>
      <S.RightSection>{right}</S.RightSection>
    </S.Container>
  );
};

export default HeaderBase;
