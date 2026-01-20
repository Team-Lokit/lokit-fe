import ChevronLeftIcon from '@/assets/images/chevronLeft.svg';
import ExploreIcon from '@/assets/images/explore.svg';
import MenuIcon from '@/assets/images/menu.svg';
import ProfileIcon from '@/assets/images/profile.svg';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import {
  HEADER_TYPE,
  ICON_SIZE,
  PROFILE_ICON_SIZE,
  PROFILE_IMAGE_SIZE,
} from './Header.constants';
import * as S from './Header.styles';

interface HeaderBaseProps {
  /** 헤더 타이틀 */
  title: string;
  /** 왼쪽 버튼 클릭 이벤트 */
  onClickLeft: () => void;
  /** 오른쪽 버튼 클릭 이벤트 */
  onClickRight: () => void;
}

interface HeaderDefaultProps extends HeaderBaseProps {
  /** 헤더 타입 */
  type?: typeof HEADER_TYPE.DEFAULT;
  /** 텍스트 버튼 텍스트 */
  buttonText?: string;
  /** 텍스트 버튼 비활성화 여부 */
  disabled?: boolean;
}

interface HeaderExploreProps extends HeaderBaseProps {
  /** 헤더 타입 */
  type: typeof HEADER_TYPE.EXPLORE;
  /** 프로필 이미지 URL */
  src?: string;
}

interface HeaderMenuProps extends HeaderBaseProps {
  /** 헤더 타입 */
  type: typeof HEADER_TYPE.MENU;
}

type HeaderProps = HeaderDefaultProps | HeaderExploreProps | HeaderMenuProps;

const Header = (props: HeaderProps) => {
  const { title, onClickLeft, onClickRight } = props;

  if (props.type === HEADER_TYPE.EXPLORE) {
    const { src } = props;
    return (
      <S.Container>
        <S.LeftSection>
          <CircleButton onClick={onClickLeft}>
            {src ? (
              <S.ProfileImage
                src={src}
                alt="프로필"
                width={PROFILE_IMAGE_SIZE}
                height={PROFILE_IMAGE_SIZE}
              />
            ) : (
              <ProfileIcon
                width={PROFILE_ICON_SIZE}
                height={PROFILE_ICON_SIZE}
                style={{ display: 'block' }}
              />
            )}
          </CircleButton>
        </S.LeftSection>
        <S.CenterSection>
          <S.LocationWrapper>
            <S.LocationIcon />
            <S.LocationText>{title}</S.LocationText>
          </S.LocationWrapper>
        </S.CenterSection>
        <S.RightSection>
          <CircleButton onClick={onClickRight}>
            <ExploreIcon width={ICON_SIZE} height={ICON_SIZE} />
          </CircleButton>
        </S.RightSection>
      </S.Container>
    );
  }

  if (props.type === HEADER_TYPE.MENU) {
    return (
      <S.Container>
        <S.LeftSection>
          <CircleButton onClick={onClickLeft}>
            <ChevronLeftIcon width={ICON_SIZE} height={ICON_SIZE} />
          </CircleButton>
        </S.LeftSection>
        <S.CenterSection>
          <S.Title>{title}</S.Title>
        </S.CenterSection>
        <S.RightSection>
          <CircleButton onClick={onClickRight}>
            <MenuIcon width={ICON_SIZE} height={ICON_SIZE} />
          </CircleButton>
        </S.RightSection>
      </S.Container>
    );
  }

  const { buttonText, disabled = false } = props;

  return (
    <S.Container>
      <S.LeftSection>
        <S.IconButton type="button" onClick={onClickLeft}>
          <ChevronLeftIcon width={ICON_SIZE} height={ICON_SIZE} />
        </S.IconButton>
      </S.LeftSection>
      <S.CenterSection>
        <S.Title>{title}</S.Title>
      </S.CenterSection>
      <S.RightSection>
        {buttonText && (
          <S.TextButton type="button" onClick={onClickRight} disabled={disabled}>
            {buttonText}
          </S.TextButton>
        )}
      </S.RightSection>
    </S.Container>
  );
};

export default Header;
