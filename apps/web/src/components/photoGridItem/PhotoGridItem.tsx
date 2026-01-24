import { useState } from 'react';
import * as S from './PhotoGridItem.styles';

interface PhotoGridItemProps {
  /** 이미지 alt 텍스트 */
  alt?: string;
  /** 이미지 src URL */
  src: string;
  /** ISO 8601 형식의 날짜 문자열 */
  date: string;
}

const PhotoGridItem = ({ alt = '', src, date }: PhotoGridItemProps) => {
  const [hasError, setHasError] = useState(false);

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;

  const showFallback = hasError || !src;

  return (
    <S.Container>
      {showFallback ? (
        <S.Fallback>{alt}</S.Fallback>
      ) : (
        <S.Photo src={src} alt={alt} onError={() => setHasError(true)} />
      )}
      <S.DateBadge>
        <S.Day>{day}</S.Day>
        <S.Month>{month}월</S.Month>
      </S.DateBadge>
    </S.Container>
  );
};

export default PhotoGridItem;
