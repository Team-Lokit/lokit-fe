import AlarmIcon from '@/assets/images/alarm.svg';
import LocationIcon from '@/assets/images/location.svg';
import HamburgerIcon from '@/assets/images/hamburger.svg';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import CrossfadeText from '@/components/common/crossfadeText/CrossfadeText';
import { BUTTON_SIZE, ICON_SIZE } from '../base/Header.constants';
import HeaderBase from '../base/HeaderBase';
import * as S from './ExploreHeader.styles';

export interface ExploreHeaderProps {
  /** 위치 타이틀 */
  title: string;
  /** ≡ 메뉴(사이드바) 버튼 클릭 이벤트 */
  onClickMenu: () => void;
  /** 알림 버튼 클릭 이벤트 */
  onClickAlarm?: (() => void) | undefined;
  /** 프로필 버튼 클릭 이벤트 @deprecated 사이드바 My로 이동 */
  onClickProfile?: () => void;
  /** 탐색 버튼 클릭 이벤트 @deprecated 사이드바 Menu로 이동 */
  onClickExplore?: () => void;
  /** 프로필 이미지 URL @deprecated */
  profileImageSrc?: string;
}

const ExploreHeader = ({ title, onClickMenu, onClickAlarm }: ExploreHeaderProps) => {
  return (
    <HeaderBase
      left={
        <CircleButton
          onClick={onClickMenu}
          aria-label="사이드바 열기"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
        >
          <HamburgerIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CircleButton>
      }
      center={
        <S.LocationWrapper>
          <S.LocationIconWrapper>
            <LocationIcon width={16} height={16} />
          </S.LocationIconWrapper>
          <S.LocationText>
            <CrossfadeText text={title} />
          </S.LocationText>
        </S.LocationWrapper>
      }
      right={
        <CircleButton
          onClick={onClickAlarm ?? (() => {})}
          aria-label="알림"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
        >
          <AlarmIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CircleButton>
      }
    />
  );
};

export default ExploreHeader;
