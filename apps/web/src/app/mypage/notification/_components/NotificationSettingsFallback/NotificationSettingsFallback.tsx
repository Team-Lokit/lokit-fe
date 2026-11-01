import Skeleton from '@/components/common/skeleton/Skeleton';
import * as S from './NotificationSettingsFallback.styles';

const ROW_COUNT = 2;

export default function NotificationSettingsFallback() {
  return (
    <>
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <S.Row key={index}>
          <S.TextGroup>
            <Skeleton width={90} height={18} borderRadius={4} />
            <Skeleton width={180} height={16} borderRadius={4} />
          </S.TextGroup>
          <Skeleton width={44} height={26} borderRadius={999} />
        </S.Row>
      ))}
    </>
  );
}
