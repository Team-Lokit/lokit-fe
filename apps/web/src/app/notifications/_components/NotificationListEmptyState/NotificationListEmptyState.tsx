import BellIcon from '@/assets/images/bell.svg';
import * as S from './NotificationListEmptyState.styles';

export default function NotificationListEmptyState() {
  return (
    <S.Wrapper>
      <BellIcon width={40} height={40} />
      <S.Text>아직 받은 알림이 없어요</S.Text>
    </S.Wrapper>
  );
}
