import Skeleton from '@/components/common/skeleton/Skeleton';
import * as S from './NotificationListFallback.styles';

const ROW_COUNT = 5;

export default function NotificationListFallback() {
  return (
    <>
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <S.Row key={index}>
          <Skeleton width={36} height={36} borderRadius={999} />
          <S.TextGroup>
            <S.TopRow>
              <Skeleton width={70} height={16} borderRadius={4} />
              <Skeleton width={48} height={14} borderRadius={4} />
            </S.TopRow>
            <Skeleton width={200} height={16} borderRadius={4} />
          </S.TextGroup>
        </S.Row>
      ))}
    </>
  );
}
