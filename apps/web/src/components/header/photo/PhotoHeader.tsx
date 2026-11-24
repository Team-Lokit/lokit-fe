'use client';

import { ReactNode } from 'react';

import ChevronLeftIcon from '@/assets/images/chevronLeft.svg';

import HeaderBase from '../base/HeaderBase';
import HeaderIconButton from '../base/HeaderIconButton';
import HeaderMenu from '../base/HeaderMenu';

export interface PhotoHeaderProps {
  /** 뒤로가기 버튼 클릭 이벤트 */
  onClickBack: () => void;
  /** 메뉴 버튼 표시 여부 */
  showMenu?: boolean;
  /** 자식 컴포넌트 (PhotoHeader.Menu) */
  children?: ReactNode;
}

const PhotoHeaderMain = ({
  onClickBack,
  showMenu = true,
  children,
}: PhotoHeaderProps) => {
  return (
    <HeaderMenu.Provider>
      <HeaderBase
        background="dim"
        left={
          <HeaderIconButton
            icon={ChevronLeftIcon}
            onClick={onClickBack}
            aria-label="뒤로가기"
          />
        }
        right={showMenu ? <HeaderMenu.Button /> : null}
      />
      {children}
    </HeaderMenu.Provider>
  );
};

const PhotoHeader = Object.assign(PhotoHeaderMain, {
  /** 메뉴 드롭다운. 안에 Menu 컴포넌트를 넣는다. */
  Menu: HeaderMenu.Dropdown,
  /** 클릭 시 메뉴가 닫히는 Menu.Item */
  Item: HeaderMenu.Item,
});

export default PhotoHeader;
