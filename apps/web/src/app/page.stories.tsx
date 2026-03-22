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
import type { MapPin } from '@/types/map.type';

const mockAlbums = [
  { id: 0, title: '전체사진', photoCount: 55, thumbnailUrls: [] },
  { id: 1, title: '일이삼사오육칠팔구십', photoCount: 11, thumbnailUrls: [] },
  { id: 2, title: '제주도', photoCount: 22, thumbnailUrls: [] },
];

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

function HomeMapView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'grid'>('map');

  return (
    <ScreenWrapper>
      <HeaderArea>
        <ExploreHeader title="대한민국" onClickMenu={() => setIsSidebarOpen(true)} />
      </HeaderArea>

      <MapPlaceholder>지도 영역</MapPlaceholder>

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
        nickname="찬혁"
        dDay={365}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
        onMyPage={fn()}
      />
    </ScreenWrapper>
  );
}

function HomeMapViewEmpty() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'grid'>('map');

  return (
    <ScreenWrapper>
      <HeaderArea>
        <ExploreHeader title="대한민국" onClickMenu={() => setIsSidebarOpen(true)} />
      </HeaderArea>

      <MapPlaceholder>지도 영역 (사진 없음)</MapPlaceholder>

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
        albums={[{ id: 0, title: '전체사진', photoCount: 0, thumbnailUrls: [] }]}
        nickname="찬혁"
        dDay={365}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
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
        nickname="찬혁"
        dDay={365}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
        onMyPage={fn()}
      />
    </ScreenWrapper>
  );
}

const mockPins: MapPin[] = [
  {
    id: 1,
    albumId: 0,
    latitude: 37.56,
    longitude: 126.97,
    imageUrl: 'https://picsum.photos/200',
    imageCount: 1,
    isCluster: false,
  },
  {
    id: 2,
    albumId: 0,
    latitude: 35.87,
    longitude: 128.6,
    imageUrl: 'https://picsum.photos/201',
    imageCount: 15,
    isCluster: true,
    clusterId: 'c1',
  },
  {
    id: 3,
    albumId: 0,
    latitude: 35.15,
    longitude: 129.06,
    imageUrl: 'https://picsum.photos/202',
    imageCount: 4,
    isCluster: true,
    clusterId: 'c2',
  },
  {
    id: 4,
    albumId: 1,
    latitude: 33.45,
    longitude: 126.57,
    imageUrl: 'https://picsum.photos/203',
    imageCount: 1,
    isCluster: false,
  },
  {
    id: 5,
    albumId: 0,
    latitude: 36.35,
    longitude: 127.38,
    imageUrl: 'https://picsum.photos/204',
    imageCount: 1,
    isCluster: false,
  },
];

const KOREA_CENTER = { latitude: 36.5, longitude: 127.5, zoom: 6.5 };

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
        nickname="찬혁"
        dDay={365}
        onExplore={fn()}
        onNewAlbum={fn()}
        onSelectAlbum={fn()}
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

export const 지도뷰: Story = {
  render: () => <HomeMapView />,
};

export const 지도뷰_빈상태: Story = {
  render: () => <HomeMapViewEmpty />,
};

export const 지도뷰_사진있음: Story = {
  render: () => <HomeMapViewWithPhotos />,
};

export const 사이드바_열림: Story = {
  render: () => <SidebarOpenView />,
};
