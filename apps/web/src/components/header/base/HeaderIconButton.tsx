import type { ComponentProps, FC, SVGProps } from 'react';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import { ICON_SIZE } from './Header.constants';

export interface HeaderIconButtonProps extends Omit<
  ComponentProps<typeof CircleButton>,
  'children'
> {
  /** 버튼 안에 넣을 SVG 아이콘 컴포넌트 */
  icon: FC<SVGProps<SVGSVGElement>>;
}

/** 헤더용 44px 원형 아이콘 버튼 (아이콘 22px) */
const HeaderIconButton = ({ icon: Icon, ...rest }: HeaderIconButtonProps) => {
  return (
    <CircleButton {...rest}>
      <Icon width={ICON_SIZE} height={ICON_SIZE} />
    </CircleButton>
  );
};

export default HeaderIconButton;
