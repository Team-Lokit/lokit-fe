'use client';

import type { ComponentType, SVGProps } from 'react';
import MapPinIcon from '@/assets/images/mapPin.svg';
import CalendarIcon from '@/assets/images/calendarFilled.svg';
import GridIcon from '@/assets/images/grid.svg';
import * as S from './ViewSwitcher.styles';

export const VIEW_TYPE_PARAM = 'viewType';

export const VIEW_TYPE = {
  MAP: 'map',
  CALENDAR: 'calendar',
  GRID: 'grid',
} as const;

export type ViewType = (typeof VIEW_TYPE)[keyof typeof VIEW_TYPE];

export const isViewType = (value: string | null): value is ViewType =>
  Object.values(VIEW_TYPE).includes(value as ViewType);

const VIEW_TABS: {
  view: ViewType;
  label: string;
  ariaLabel: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { view: VIEW_TYPE.MAP, label: '지도', ariaLabel: '지도보기', Icon: MapPinIcon },
  {
    view: VIEW_TYPE.CALENDAR,
    label: '캘린더',
    ariaLabel: '캘린더보기',
    Icon: CalendarIcon,
  },
  { view: VIEW_TYPE.GRID, label: '격자', ariaLabel: '격자보기', Icon: GridIcon },
];

interface ViewSwitcherProps {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const ViewSwitcher = ({ activeView, onChangeView }: ViewSwitcherProps) => {
  return (
    <S.Container>
      {VIEW_TABS.map(({ view, label, ariaLabel, Icon }) => {
        const isActive = activeView === view;
        return (
          <S.Tab
            key={view}
            $isActive={isActive}
            onClick={() => onChangeView(view)}
            aria-label={ariaLabel}
            aria-pressed={isActive}
          >
            <S.TabIcon $isActive={isActive}>
              <Icon />
            </S.TabIcon>
            {isActive && <S.TabLabel>{label}</S.TabLabel>}
          </S.Tab>
        );
      })}
    </S.Container>
  );
};

export default ViewSwitcher;
