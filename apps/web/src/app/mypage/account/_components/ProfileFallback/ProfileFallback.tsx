import * as S from './ProfileFallback.style';
import Skeleton from '@/components/common/skeleton/Skeleton';

type ProfileFallbackType = 'profileName' | 'connectedAccount' | 'versionInfo';

interface ProfileFallbackProps {
  type: ProfileFallbackType;
}

const PROFILE_FALLBACK_TITLE: Record<ProfileFallbackType, string> = {
  profileName: '이름',
  connectedAccount: '연결된 계정',
  versionInfo: '나의 버전 정보',
};

export default function ProfileFallback({ type }: ProfileFallbackProps) {
  return (
    <S.Row>
      <S.RowTitle>{PROFILE_FALLBACK_TITLE[type]}</S.RowTitle>
      <S.RowValue>
        <Skeleton width={70} height={25.6} borderRadius={16} />
      </S.RowValue>
    </S.Row>
  );
}
