import { createContext, ReactNode, useContext } from 'react';
import * as S from './Menu.styles';

export type MenuSize = 'sm' | 'md';
export type MenuItemVariant = 'default' | 'danger';

interface MenuContextValue {
  size: MenuSize;
}

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('Menu.Item은 Menu 내부에서 사용해주세요.');
  }

  return context;
};

interface MenuProps {
  size?: MenuSize;
  children: ReactNode;
}

const MenuMain = ({ size = 'md', children }: MenuProps) => {
  return (
    <MenuContext.Provider value={{ size }}>
      <S.Wrapper $size={size}>{children}</S.Wrapper>
    </MenuContext.Provider>
  );
};

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: MenuItemVariant;
  disabled?: boolean;
}

const MenuItem = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
}: MenuItemProps) => {
  const { size } = useMenuContext();

  return (
    <S.Item
      type="button"
      $size={size}
      $variant={variant}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </S.Item>
  );
};

const Menu = Object.assign(MenuMain, {
  Item: MenuItem,
});

export default Menu;
