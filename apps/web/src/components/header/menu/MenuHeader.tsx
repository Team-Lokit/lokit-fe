'use client';

import { ReactNode } from 'react';
import ChevronLeftIcon from '@/assets/images/chevronLeft.svg';
import CrossfadeText from '@/components/common/crossfadeText/CrossfadeText';
import Menu from '@/components/menu/Menu';
import HeaderBase from '../base/HeaderBase';
import HeaderIconButton from '../base/HeaderIconButton';
import HeaderMenu from '../base/HeaderMenu';
import * as B from '../base/Header.styles';
import * as S from './MenuHeader.styles';
import * as E from '../explore/ExploreHeader.styles';

export type { HeaderMenuItemProps as MenuItemProps } from '../base/HeaderMenu';

export interface MenuHeaderProps {
  /** 헤더 타이틀 */
  title: string;
  /** 뒤로가기 버튼 클릭 이벤트 */
  onClickBack: () => void;
  /** 자식 컴포넌트 (MenuHeader.Menu) */
  children?: ReactNode;
  /** 위치 아이콘 표시 여부 */
  showLocation?: boolean;
  /** 메뉴 버튼 표시 여부 */
  showMenu?: boolean;
}

const MenuHeaderMain = ({
  title,
  onClickBack,
  children,
  showLocation,
  showMenu = true,
}: MenuHeaderProps) => {
  return (
    <HeaderMenu.Provider>
      <S.MenuHeaderWrapper>
        <HeaderBase
          left={
            <HeaderIconButton
              icon={ChevronLeftIcon}
              onClick={onClickBack}
              aria-label="뒤로가기"
            />
          }
          center={
            <B.CenterSection>
              {showLocation && <E.LocationArrowIcon />}
              {title && (
                <B.Title>
                  <CrossfadeText text={title} />
                </B.Title>
              )}
            </B.CenterSection>
          }
          right={showMenu ? <HeaderMenu.Button /> : null}
        />
        {children}
      </S.MenuHeaderWrapper>
    </HeaderMenu.Provider>
  );
};

/** 메뉴 드롭다운. 안에 MenuHeader.Item을 넣는다. */
const MenuHeaderMenu = ({ children }: { children: ReactNode }) => (
  <HeaderMenu.Dropdown>
    <Menu>{children}</Menu>
  </HeaderMenu.Dropdown>
);

const MenuHeader = Object.assign(MenuHeaderMain, {
  Menu: MenuHeaderMenu,
  Item: HeaderMenu.Item,
});

export default MenuHeader;
