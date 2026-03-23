import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import styled from '@emotion/styled';
import { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import ViewSwitcher from '@/components/viewSwitcher/ViewSwitcher';
import FloatingButton from '@/components/buttons/floatingButton/FloatingButton';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import MapView from '@/components/map/MapView';
import CrossHairIcon from '@/assets/images/crossHair.svg';
import AddIcon from '@/assets/images/add.svg';
import { ExploreHeader } from '@/components/header';
import HomeEmptyState from '@/components/common/homeEmptyState/HomeEmptyState';
import type { MapPin } from '@/types/map.type';
import {
  지도_ME_조회_성공,
  지도_ME_조회_사진없음,
} from '@/mocks/handlers/map/getMapMe/mockData';
import { 마이페이지_조회_성공 } from '@/mocks/handlers/mypage/getMyPage/mockData';

const mockAlbums = 지도_ME_조회_성공.albums ?? [];
const mockAlbumsEmpty = [{ id: 0, title: '전체사진', photoCount: 0, thumbnailUrls: [] }];

const ScreenWrapper = styled.div`
  width: 375px;
  height: 812px;
  position: relative;
  background: #1a1a1c;
  overflow: hidden;
`;

const HeaderArea = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1010;
`;

const FloatingButtonArea = styled.div`
  position: absolute;
  left: 50%;
  top: 54px;
  transform: translateX(-50%);
  z-index: 999;
`;

const ViewSwitcherArea = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
`;

const ActionArea = styled.div`
  position: absolute;
  right: 12px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1001;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #242426;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525156;
  font-size: 14px;
`;

function HomeMapViewEmpty() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'grid'>('map');

  return (
    <ScreenWrapper>
      <HeaderArea>
        <ExploreHeader title="대한민국" onClickMenu={() => setIsSidebarOpen(true)} />
      </HeaderArea>

      <MapView locationState={KOREA_CENTER} pins={[]} onPinClick={fn()} />

      <ActionArea>
        <CircleButton onClick={fn()} aria-label="추가">
          <AddIcon />
        </CircleButton>
        <CircleButton onClick={fn()} aria-label="현재 위치로 이동">
          <CrossHairIcon />
        </CircleButton>
      </ActionArea>

      <FloatingButtonArea>
        <FloatingButton text="기록 0개" />
      </FloatingButtonArea>

      <ViewSwitcherArea>
        <ViewSwitcher activeView={activeView} onChangeView={setActiveView} />
      </ViewSwitcherArea>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        albums={mockAlbumsEmpty}
        nickname={마이페이지_조회_성공.myName ?? ''}
        dDay={마이페이지_조회_성공.coupledDay ?? 0}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
        onRenameAlbum={fn()}
        onDeleteAlbum={fn()}
        onMyPage={fn()}
      />
    </ScreenWrapper>
  );
}

function SidebarOpenView() {
  return (
    <ScreenWrapper>
      <HeaderArea>
        <ExploreHeader title="대한민국" onClickMenu={fn()} />
      </HeaderArea>

      <MapPlaceholder>지도 영역</MapPlaceholder>

      <Sidebar
        isOpen={true}
        onClose={fn()}
        albums={mockAlbums}
        nickname={마이페이지_조회_성공.myName ?? ''}
        dDay={마이페이지_조회_성공.coupledDay ?? 0}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
        onRenameAlbum={fn()}
        onDeleteAlbum={fn()}
        onMyPage={fn()}
      />
    </ScreenWrapper>
  );
}

const mockMapData = 지도_ME_조회_성공;
const mockPins: MapPin[] = [
  ...(mockMapData.photos ?? []).map((p) => ({
    id: p.id ?? 0,
    albumId: 0,
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,
    imageUrl: p.thumbnailUrl ?? '',
    imageCount: 1,
    isCluster: false,
  })),
  ...(mockMapData.clusters ?? []).map((c) => ({
    id: 0,
    albumId: 0,
    latitude: c.latitude ?? 0,
    longitude: c.longitude ?? 0,
    imageUrl: c.thumbnailUrl ?? '',
    imageCount: c.count ?? 0,
    isCluster: true,
    clusterId: c.clusterId,
  })),
];

const KOREA_CENTER = { latitude: 37.5665, longitude: 126.978, zoom: 13 };

function HomeMapViewWithPhotos() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'grid'>('map');

  return (
    <ScreenWrapper>
      <HeaderArea>
        <ExploreHeader title="대한민국" onClickMenu={() => setIsSidebarOpen(true)} />
      </HeaderArea>

      <MapView locationState={KOREA_CENTER} pins={mockPins} onPinClick={fn()} />

      <ActionArea>
        <CircleButton onClick={fn()} aria-label="추가">
          <AddIcon />
        </CircleButton>
        <CircleButton onClick={fn()} aria-label="현재 위치로 이동">
          <CrossHairIcon />
        </CircleButton>
      </ActionArea>

      <FloatingButtonArea>
        <FloatingButton text="기록 55개" />
      </FloatingButtonArea>

      <ViewSwitcherArea>
        <ViewSwitcher activeView={activeView} onChangeView={setActiveView} />
      </ViewSwitcherArea>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        albums={mockAlbums}
        nickname={마이페이지_조회_성공.myName ?? ''}
        dDay={마이페이지_조회_성공.coupledDay ?? 0}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
        onRenameAlbum={fn()}
        onDeleteAlbum={fn()}
        onMyPage={fn()}
      />
    </ScreenWrapper>
  );
}

const meta: Meta = {
  title: 'Pages/Home',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const 지도뷰_빈상태: Story = {
  render: () => <HomeMapViewEmpty />,
};

export const 지도뷰_사진있음: Story = {
  render: () => <HomeMapViewWithPhotos />,
};

export const 격자뷰_빈상태: Story = {
  render: () => {
    const EmptyWrapper = styled.div`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding-top: 100px;
    `;
    return (
      <ScreenWrapper>
        <HeaderArea>
          <ExploreHeader title="전체사진" onClickMenu={fn()} />
        </HeaderArea>
        <EmptyWrapper>
          <HomeEmptyState onAddPhoto={fn()} onAddAlbum={fn()} />
        </EmptyWrapper>
        <FloatingButtonArea>
          <FloatingButton text="기록 0개" />
        </FloatingButtonArea>
        <ViewSwitcherArea>
          <ViewSwitcher activeView="grid" onChangeView={fn()} />
        </ViewSwitcherArea>
      </ScreenWrapper>
    );
  },
};

export const 사이드바_열림: Story = {
  render: () => <SidebarOpenView />,
};
