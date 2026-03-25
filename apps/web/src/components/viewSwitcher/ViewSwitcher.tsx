'use client';

import MapPinIcon from '@/assets/images/mapPin.svg';
import GridIcon from '@/assets/images/grid.svg';
import * as S from './ViewSwitcher.styles';

export const VIEW_TYPE = {
  MAP: 'map',
  GRID: 'grid',
} as const;

export type ViewType = (typeof VIEW_TYPE)[keyof typeof VIEW_TYPE];

interface ViewSwitcherProps {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const ViewSwitcher = ({ activeView, onChangeView }: ViewSwitcherProps) => {
  return (
    <S.Container>
      <S.Tab
        $isActive={activeView === VIEW_TYPE.MAP}
        onClick={() => onChangeView(VIEW_TYPE.MAP)}
        aria-label="지도보기"
      >
        <S.TabIcon $isActive={activeView === VIEW_TYPE.MAP}>
          <MapPinIcon />
        </S.TabIcon>
        {activeView === VIEW_TYPE.MAP && <S.TabLabel>지도보기</S.TabLabel>}
      </S.Tab>
      <S.Tab
        $isActive={activeView === VIEW_TYPE.GRID}
        onClick={() => onChangeView(VIEW_TYPE.GRID)}
        aria-label="격자보기"
      >
        <S.TabIcon $isActive={activeView === VIEW_TYPE.GRID}>
          <GridIcon />
        </S.TabIcon>
        {activeView === VIEW_TYPE.GRID && <S.TabLabel>격자보기</S.TabLabel>}
      </S.Tab>
    </S.Container>
  );
};

export default ViewSwitcher;
