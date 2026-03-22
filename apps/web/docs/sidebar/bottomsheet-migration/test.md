# Sidebar 검증 문서

> BottomSheet → Sidebar 전환 검증 체크리스트
> 작성일: 2026-03-22

---

## 1. 컴포넌트 렌더링 검증

> **검증 방법**: `pnpm storybook` → `Pages/Home`, `Components/Sidebar`, `Components/ViewSwitcher`

### 1.1 Sidebar 구조

- [x] Sidebar가 화면 좌측에 오버레이로 표시되는가
- [x] 고정 너비 270px이 적용되는가
- [x] 높이가 화면 전체(100vh)를 채우는가
- [x] 배경색 `gray.a80` (`rgba(36,36,38,0.8)`)이 적용되는가
- [x] `backdrop-filter: blur(40px)`이 적용되는가
- [x] `border-right: 1px solid blueWhite.border10` (`rgba(226,230,255,0.10)`)이 적용되는가
- [x] z-index가 `zIndex.overlay` (1100)로 설정되어 모달(1200)보다 낮은가

### 1.2 Header

- [x] "LOKIT" 워드마크 SVG(`lokitWordmark.svg`)가 좌측에 흰색(`gray[0]`, `#FFFFFF`)으로 표시되는가
- [x] 워드마크 크기가 60×14px인가
- [x] ✕ 닫기 버튼(`close.svg`, 20×20px)이 우측에 표시되는가
- [x] 패딩이 `pl: 12px, py: 8px`인가

### 1.3 SearchInput

- [x] "앨범을 검색해보세요..." placeholder가 `gray[400]` 색상으로 표시되는가
- [x] 검색 아이콘(`search.svg`, 16×16px)이 표시되는가
- [x] 배경색이 `blueWhite.bg5` (`rgba(226,230,255,0.05)`)인가
- [x] `border-radius: 12px`, 패딩 `px: 12px, py: 10px`이 적용되는가
- [x] 기존 `Input` 컴포넌트가 재사용되었는가
- [x] 기본 상태에서 border 없음, 포커스 시에만 표시
- [x] 텍스트 입력 시 reset 아이콘이 밀리지 않는가
- [x] 입력 필드가 정상적으로 포커스/입력 가능한가 _(interaction test: SearchInputFocus 통과)_

### 1.4 Menu

- [x] "탐색" 메뉴가 `explore.svg` (20×20px) 아이콘과 함께 표시되는가
- [x] "새 앨범" 메뉴가 `newAlbum.svg` (20×20px) 아이콘과 함께 표시되는가
- [x] 메뉴 아이템 간 gap이 `4px`인가
- [x] 아이템 텍스트가 `body-16-medium`, `text.primary` (`#D3D3D3`)인가

### 1.5 AlbumList

- [x] "앨범" 라벨이 `body-14-regular`, `gray[500]` (`#7B7B7D`)로 표시되는가
- [x] 선택된 앨범이 `blueWhite.bg8` 배경 강조 스타일로 표시되는가
- [x] 선택된 앨범이 없으면 전체사진(첫 번째)이 기본 active
- [x] 전체사진 앨범에 사진 개수가 표시되는가
- [x] 사용자 생성 앨범에 제목 + 사진 개수가 표시되는가
- [x] 사용자 생성 앨범에 더보기(···) 메뉴가 표시되는가
- [x] 전체사진(기본 앨범)에는 더보기 메뉴가 없는가
- [x] AlbumListItem 패딩이 `px: 12px, py: 10px`, gap `20px`, `border-radius: 12px`인가
- [x] hover/pressed 시 `blueWhite.bg8` 배경 효과 _(코드: `transition: background-color 0.15s ease` + `&:hover` 적용)_
- [x] 검색 결과 없을 때 안내 메시지가 표시되는가
- [x] 스크롤바가 숨겨져 있는가

### 1.6 My

- [x] 하단에 고정 배치되는가 (`margin-top: auto` 또는 flex 레이아웃)
- [x] 상단 구분선 `border-top: 1px solid blueWhite.border10`이 있는가
- [x] 프로필 원형이 `44px` 크기이며 `blueWhite.bg8` 배경 + `backdropBlur[25]`가 적용되는가
- [x] 프로필 이미지(키 아이콘 아바타)가 `36px` 원형으로 표시되는가
- [x] 닉네임이 `body-16-medium`, `gray[100]` (`#E8E8E8`)로 표시되는가
- [x] D-day 뱃지가 `blueWhite.bg8` 배경, `border-radius: 8px`인가
- [x] D-day 텍스트가 `body-15-medium`, `gray[300]` (`#B2B2B4`)이며 하트 아이콘(`12px`, `gray[400]`)과 함께 표시되는가

### 1.7 홈 화면 레이아웃

- [x] 헤더 좌측에 ≡ 햄버거 아이콘(`hamburger.svg`)이 표시되는가
- [x] 헤더 우측에 🔔 알림 아이콘(`alarm.svg`)이 표시되는가
- [x] "기록 N개" 뱃지가 헤더 바로 아래(상단)에 표시되는가
- [x] ViewSwitcher가 하단 중앙에 표시되는가
- [x] - 버튼, 현재위치 버튼이 우측 하단에 표시되는가
- [x] 앨범 상세에서도 ≡ 햄버거 메뉴가 유지되는가 (뒤로가기 아님)

---

## 2. 인터랙션 검증

> 스토리북 interaction test + `Pages/Home` 스토리에서 확인

### 2.1 사이드바 열기/닫기

- [x] ≡ 햄버거 버튼 클릭 시 사이드바가 열리는가 _(코드: `onOpenSidebar → setIsSidebarOpen(true)`)_
- [x] ✕ 버튼 클릭 시 사이드바가 닫히는가 _(코드: `handleClose → onClose`)_
- [x] 사이드바 외부(backdrop) 클릭 시 닫히는가 _(코드: `Backdrop onClick={handleClose}`)_
- [x] ESC 키 입력 시 닫히는가 _(코드: `document keydown Escape → handleClose`)_

### 2.2 열기/닫기 애니메이션

- [x] 열릴 때 좌측에서 슬라이드 인 _(코드: `slideIn keyframe`)_
- [x] 닫힐 때 좌측으로 슬라이드 아웃 _(코드: `slideOut keyframe, isClosing 상태`)_
- [x] Backdrop이 fade in/out _(코드: `fadeIn/fadeOut keyframe`)_
- [x] transition이 `0.3s ease` _(코드: `animation 0.3s ease forwards`)_

### 2.3 검색 기능

- [x] 검색어 입력 시 앨범 목록이 실시간 필터링 _(interaction test: SearchFiltering 통과)_
- [x] 필터링 로직이 앨범 제목 포함 여부 기반인가
- [x] 검색어 삭제 시 전체 앨범 목록이 복원 _(interaction test: SearchReset)_
- [x] 사이드바 닫았다 열면 검색어 초기화 _(코드: 컴포넌트 언마운트 시 상태 리셋)_
- [x] 한글 검색이 정상 동작하는가 _(interaction test: KoreanSearch 통과)_

### 2.4 메뉴 동작

- [x] "탐색" 클릭 시 탐색 페이지로 이동 _(interaction test: MenuClick 통과)_
- [x] "새 앨범" 클릭 시 앨범 추가 모달 열림 _(코드: `onNewAlbum → setIsAddModalOpen(true)`)_

### 2.5 앨범 리스트 동작

- [x] 앨범 클릭 시 해당 앨범 상세로 이동 _(interaction test: AlbumClick 통과)_
- [x] 앨범 클릭 시 사이드바 닫힘 _(코드: `handleSelectAlbum → setIsSidebarOpen(false)`)_
- [x] 선택된 앨범이 active 표시 _(코드: `selectedAlbumId prop`)_

> 더보기(···) 메뉴 드롭다운 및 이름 변경/삭제 모달 연결은 추후 이슈로 진행

### 2.6 My 영역 동작

- [x] My 영역 클릭 시 마이페이지로 이동 _(interaction test: MyPageClick 통과)_

### 2.7 뷰 전환

- [x] 격자보기 클릭 시 지도 → 그리드뷰 전환 _(코드: `activeView === 'grid' → PhotoGridContainer`)_
- [x] 지도보기 클릭 시 그리드 → 지도뷰 전환 _(코드: `activeView === 'map' → MapView`)_

---

## 3. 상태 관리 검증

### 3.1 사이드바 상태

- [x] 사이드바 열림/닫힘 상태가 홈 화면 레벨에서 관리 _(코드: `MapRoute → isSidebarOpen`)_
- [x] 사이드바 열림 시 지도/격자뷰가 뒤에 유지 _(코드: 조건부 렌더링 아닌 오버레이)_
- [x] 사이드바 열림 시 배경 스크롤 잠김 _(코드: `body.style.overflow = 'hidden'`)_
- [x] 앨범 선택 시 사이드바 닫힘 _(코드: `handleSelectAlbum → setIsSidebarOpen(false)`)_

### 3.2 앨범 데이터

> 기존 react-query invalidation 로직이 그대로 유지되므로 이번 PR에서는 검증 대상 아님

---

## 4. 뷰 전환 검증

### 4.0 ViewSwitcher

- [x] pill 형태의 토글이 표시되는가
- [x] 활성 탭에 아이콘 + 텍스트가 표시되고, 비활성 탭에 아이콘만 표시되는가
- [x] 활성 탭 배경이 `gray[100]` (`#E8E8E8`)인가
- [x] 배경에 `blueWhite.bg8` + `backdropBlur[25]` + `blueWhite.border10` 테두리가 적용되는가
- [x] 지도보기 클릭 시 지도뷰로 전환 _(코드: `setActiveView`)_
- [x] 격자보기 클릭 시 격자뷰로 전환 _(코드: `setActiveView`)_
- [x] 지도보기 아이콘이 `mapPin.svg`, 격자보기 아이콘이 `grid.svg`인가

### 4.1 지도뷰

- [x] 사이드바가 닫힌 상태에서 지도가 전체 화면으로 표시 _(Pages/Home 스토리로 확인)_
- [x] 지도 위 사진 핀이 정상 표시 _(MSW 목데이터 핀으로 확인)_
- [x] 상단에 "기록 N개" 플로팅 버튼 표시
- [x] 하단에 ViewSwitcher 표시
- [x] ≡ 버튼으로 사이드바 열기 가능

### 4.2 격자뷰

- [x] 격자보기 전환 시 PhotoGridContainer 렌더링 _(코드: `activeView === 'grid'`)_
- [x] 사진이 없을 때 빈 상태 UI 표시 _(코드: `displayPhotos.length === 0 → HomeEmptyState`)_
- [x] 빈 상태에서 "사진 추가", "앨범 추가" 카드 연결 _(코드: `onAddPhoto → selectPhotosFromFile`, `onAddAlbum → setIsAddModalOpen`)_
- [x] 하단에 ViewSwitcher 표시

---

## 5. 기존 기능 회귀 검증

> 기존 로직을 그대로 유지한 항목은 이번 PR 검증 범위 밖
> 핀 클릭, 앨범 라우팅, 지도 상태, 위치 권한 등은 기존 코드 유지

### 5.1 사진 관련

- [x] 사진 추가 플로우 연결 _(코드: `selectPhotosFromFile → handlePhotosSelected`)_
- [x] 지도 핀/클러스터 클릭 → 상세 이동 _(코드: `handlePinClick` 기존 로직 유지)_

### 5.2 앨범 관련

- [x] 앨범 추가 모달 연결 _(코드: `AlbumAddModalContainer`)_
- [x] 앨범 이름 변경/삭제 모달 연결 _(코드: `AlbumRenameModalContainer`, `AlbumDeleteModalContainer`)_

### 5.3 지도 관련

- [x] 현재 위치로 이동 기능 연결 _(코드: `handleGoToCurrentLocation`)_
- [x] 위치 권한 거부 시 안내 모달 _(코드: `LocationPermissionModal` 기존 로직 유지)_

### 5.4 헤더 관련

- [x] 주소 표시 연결 _(코드: `address || '위치 정보 로딩 중'`)_
- [x] 앨범 상세 시 ≡ 햄버거 메뉴 유지 _(코드: `MapRouteHeader → ExploreHeader 통일`)_

---

## 6. 엣지 케이스 검증

- [x] 앨범이 0개일 때 사이드바가 정상 표시되는가 _(EmptyAlbums 스토리)_
- [x] 앨범이 많을 때(20개+) AlbumList 영역 스크롤이 정상 동작하는가 _(ManyAlbums 스토리 렌더링 통과)_
- [x] 앨범 이름이 매우 길 때 말줄임(ellipsis) 처리 _(LongTitle 스토리)_
- [x] 사진 개수가 매우 클 때(10000+) 숫자 표시가 깨지지 않는가 _(99999로 확인)_

---

## 7. 접근성 검증

- [x] `<aside>` 시맨틱 태그가 사용되었는가
- [x] 닫기 버튼에 `aria-label`이 있는가
- [x] ≡ 버튼에 `aria-label="사이드바 열기"`가 있는가
- [x] 🔔 버튼에 `aria-label="알림"`이 있는가

> 키보드 탐색(Tab), 스크린리더 검증은 접근성 전용 이슈로 분리

---

## 8. 테마 토큰 / 코드 품질 검증

- [x] `blueWhite.border10` 값이 피그마 기준 `rgba(226,230,255,0.10)`으로 수정되었는가
- [x] 기존 `blueWhite.border10` 사용처에 사이드 이펙트가 없는가
- [x] Sidebar에 사용된 모든 색상이 `theme.colors`에서 참조되는가
- [x] Sidebar의 nickname/dDay가 `useGetMyPage` API에서 가져오는가
- [x] ViewSwitcher의 `activeView` 상태가 MapRoute에서 관리되는가
- [x] Sidebar에 사용된 효과가 `theme.effects`에서 참조되는가
- [x] Sidebar 너비가 `theme.layout.sidebarWidth`를 참조하는가
- [x] MSW 목데이터를 스토리북에서 재사용하는가
- [x] 빌드 통과
- [x] 린트 통과 (신규 코드 warning/error 없음)
- [x] Storybook test runner 전체 통과 (93/93)

---

## 추후 이슈로 분리

- 더보기(···) 메뉴 드롭다운 구현 및 이름 변경/삭제 모달 연결
- 성능 최적화 (리렌더링 검증)
- 접근성 심화 (키보드 탐색, 스크린리더)
- `constants.ts` (SheetContext) 리팩토링
- ExploreHeader `@deprecated` props 정리
