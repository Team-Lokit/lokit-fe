import BellIcon from '@/assets/images/bell.svg';
import BellCircleIcon from '@/assets/images/bellCircle.svg';
import HamburgerIcon from '@/assets/images/hamburger.svg';
import CrossfadeText from '@/components/common/crossfadeText/CrossfadeText';
import HeaderBase from '../base/HeaderBase';
import HeaderIconButton from '../base/HeaderIconButton';
import * as S from './ExploreHeader.styles';

export interface ExploreHeaderProps {
  /** 위치 타이틀 */
  title: string;
  /** ≡ 메뉴(사이드바) 버튼 클릭 이벤트 */
  onClickMenu: () => void;
  /** 알림 버튼 클릭 이벤트 */
  onClickAlarm?: (() => void) | undefined;
  /** 안 읽은 알림 존재 여부 (true면 알림 버튼 아이콘이 bellCircle로 바뀜) */
  hasUnreadNotification?: boolean;
  /** 우측 버튼 커스텀 슬롯 (지정 시 알림 버튼 대체) */
  rightSlot?: React.ReactNode;
}

const ExploreHeader = ({
  title,
  onClickMenu,
  onClickAlarm,
  hasUnreadNotification,
  rightSlot,
}: ExploreHeaderProps) => {
  return (
    <HeaderBase
      left={
        <HeaderIconButton
          icon={HamburgerIcon}
          onClick={onClickMenu}
          aria-label="사이드바 열기"
        />
      }
      center={
        <S.LocationWrapper>
          <S.LocationText>
            <CrossfadeText text={title} />
          </S.LocationText>
        </S.LocationWrapper>
      }
      right={
        rightSlot ?? (
          <HeaderIconButton
            icon={hasUnreadNotification ? BellCircleIcon : BellIcon}
            onClick={onClickAlarm}
            aria-label="알림"
          />
        )
      }
    />
  );
};

export default ExploreHeader;
