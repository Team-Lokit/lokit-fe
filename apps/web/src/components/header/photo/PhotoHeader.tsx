import { createContext, ReactNode, useContext, useState } from 'react';

import ChevronLeftIcon from '@/assets/images/chevronLeft.svg';
import MenuIcon from '@/assets/images/menu.svg';
import CircleButton from '@/components/buttons/circleButton/CircleButton';

import { BUTTON_SIZE, ICON_SIZE } from '../base/Header.constants';
import * as S from './PhotoHeader.styles';

interface PhotoHeaderContextValue {
  isOpen: boolean;
  close: () => void;
}

const PhotoHeaderContext = createContext<PhotoHeaderContextValue | null>(null);

const usePhotoHeaderContext = () => {
  const context = useContext(PhotoHeaderContext);

  if (!context) {
    throw new Error('PhotoHeader 컴포넌트 내부에서 사용해주세요.');
  }

  return context;
};

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
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <PhotoHeaderContext.Provider value={{ isOpen, close }}>
      <S.Container>
        <CircleButton
          onClick={onClickBack}
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
        >
          <ChevronLeftIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CircleButton>

        {showMenu ? (
          <CircleButton
            onClick={handleClickMenu}
            style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          >
            <MenuIcon width={ICON_SIZE} height={ICON_SIZE} />
          </CircleButton>
        ) : null}

        {children}
      </S.Container>
    </PhotoHeaderContext.Provider>
  );
};

interface MenuProps {
  children: ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  const { isOpen, close } = usePhotoHeaderContext();

  if (!isOpen) return null;

  return (
    <>
      <S.MenuBackdrop onClick={close} />
      <S.MenuDropdown>{children}</S.MenuDropdown>
    </>
  );
};

export interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

const PhotoHeader = Object.assign(PhotoHeaderMain, {
  Menu,
});

export default PhotoHeader;
