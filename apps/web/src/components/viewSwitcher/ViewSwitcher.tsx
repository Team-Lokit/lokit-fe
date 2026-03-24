'use client';

import MapPinIcon from '@/assets/images/mapPin.svg';
import GridIcon from '@/assets/images/grid.svg';
import * as S from './ViewSwitcher.styles';

type ViewType = 'map' | 'grid';

interface ViewSwitcherProps {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const ViewSwitcher = ({ activeView, onChangeView }: ViewSwitcherProps) => {
  return (
    <S.Container>
      <S.Tab
        $isActive={activeView === 'map'}
        onClick={() => onChangeView('map')}
        aria-label="지도보기"
      >
        <S.TabIcon $isActive={activeView === 'map'}>
          <MapPinIcon />
        </S.TabIcon>
        {activeView === 'map' && <S.TabLabel>지도보기</S.TabLabel>}
      </S.Tab>
      <S.Tab
        $isActive={activeView === 'grid'}
        onClick={() => onChangeView('grid')}
        aria-label="격자보기"
      >
        <S.TabIcon $isActive={activeView === 'grid'}>
          <GridIcon />
        </S.TabIcon>
        {activeView === 'grid' && <S.TabLabel>격자보기</S.TabLabel>}
      </S.Tab>
    </S.Container>
  );
};

export default ViewSwitcher;
