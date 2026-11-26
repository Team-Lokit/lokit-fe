'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import MenuIcon from '@/assets/images/menu.svg';
import Menu, { type MenuItemVariant } from '@/components/menu/Menu';
import HeaderIconButton from './HeaderIconButton';
import * as S from './HeaderMenu.styles';

interface HeaderMenuContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const HeaderMenuContext = createContext<HeaderMenuContextValue | null>(null);

const useHeaderMenu = () => {
  const context = useContext(HeaderMenuContext);
  if (!context) {
    throw new Error('HeaderMenu 내부에서 사용해주세요.');
  }
  return context;
};

/** 헤더 우측 ⋯ 메뉴의 열림 상태를 공유한다. 헤더 컴포넌트 최상단을 감싼다. */
const HeaderMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  return (
    <HeaderMenuContext.Provider value={value}>{children}</HeaderMenuContext.Provider>
  );
};

/** 메뉴를 여닫는 ⋯ 버튼 */
const HeaderMenuButton = () => {
  const { toggle } = useHeaderMenu();

  return <HeaderIconButton icon={MenuIcon} onClick={toggle} aria-label="메뉴" />;
};

/** 열렸을 때 백드롭과 함께 헤더 우측 아래에 children을 띄운다. */
const HeaderMenuDropdown = ({ children }: { children: ReactNode }) => {
  const { isOpen, close } = useHeaderMenu();

  if (!isOpen) return null;

  return (
    <>
      <S.Backdrop onClick={close} />
      <S.Dropdown>{children}</S.Dropdown>
    </>
  );
};

export interface HeaderMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: MenuItemVariant;
}

/** 클릭 시 메뉴를 닫는 Menu.Item. Menu 안에서 사용한다. */
const HeaderMenuItem = ({ children, onClick, variant }: HeaderMenuItemProps) => {
  const { close } = useHeaderMenu();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <Menu.Item onClick={handleClick} variant={variant}>
      {children}
    </Menu.Item>
  );
};

const HeaderMenu = {
  Provider: HeaderMenuProvider,
  Button: HeaderMenuButton,
  Dropdown: HeaderMenuDropdown,
  Item: HeaderMenuItem,
};

export default HeaderMenu;
