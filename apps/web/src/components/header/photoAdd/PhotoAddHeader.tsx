import { ReactNode } from 'react';
import * as S from './PhotoAddHeader.styles';

export interface PhotoAddHeaderProps {
  /** 왼쪽 영역 (닫기 버튼) */
  left?: ReactNode;
}

const PhotoAddHeader = ({ left }: PhotoAddHeaderProps) => {
  return <S.Container>{left}</S.Container>;
};

export default PhotoAddHeader;
