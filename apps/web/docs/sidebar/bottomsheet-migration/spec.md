# Sidebar 스펙 문서

> BottomSheet → Sidebar 전환 스펙
> 작성일: 2026-03-22

---

## 1. 개요

기존 모바일 중심의 BottomSheet(드래그 기반 높이 조절) UI를 **좌측 고정 Sidebar** UI로 전환한다.
지도 뷰 위에 오버레이 형태로 표시되며, 열기/닫기 토글 방식으로 동작한다.

- **대상**: 웹(`apps/web`) 전용. 모바일(`apps/mobile`)은 별도.
- **범위 외**: 사용자 생성 앨범의 앨범 상세 헤더 변경(알림 → 메뉴)은 별도 이슈로 진행 예정.

### 피그마 참고 링크

| 컴포넌트/화면             | 피그마 링크                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| Sidebar 컴포넌트          | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6099-15561&m=dev) |
| List Item (AlbumListItem) | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6099-7787&m=dev)  |
| View Switcher             | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6099-15917&m=dev) |
| 홈 - 지도뷰               | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6096-4876&m=dev)  |
| 홈 - 격자뷰               | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6096-5077&m=dev)  |
| 홈 - 격자뷰 (빈 상태)     | [Figma](https://www.figma.com/design/jCHkG2pc6SC7dwyO2gdIlI/-Lokit--V1-Launch?node-id=6096-4853&m=dev)  |

---

## 2. 사이드바 컴포넌트 구조

```
Sidebar
├── Header            ← 로고("LOKIT") + 닫기(✕) 버튼
├── SearchInput       ← 앨범 검색 입력필드
├── Menu
│   ├── Explore       ← 탐색 메뉴 아이템 (아이콘 + "탐색")
│   └── NewAlbum      ← 새 앨범 메뉴 아이템 (아이콘 + "새 앨범")
├── AlbumList         ← 앨범 목록 영역 ("앨범" 라벨 포함)
│   └── AlbumListItem ← 개별 앨범 아이템
│       ├── icon?     ← 선택적 아이콘
│       ├── title     ← 앨범 이름
│       ├── totalCount? ← 사진 개수
│       └── showMenu? ← 더보기 메뉴 (···) 표시 여부
└── My                ← 하단 고정 사용자 프로필 영역 (프로필 이미지 + 닉네임 + D+일수)
```

---

## 3. 스타일 토큰 매핑

### 3.1 Sidebar 컨테이너

| 속성            | 피그마 값                | 테마 토큰                               | 비고                                                                     |
| --------------- | ------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| 너비            | `270px`                  | `theme.layout.sidebarWidth` (신규 추가) | 고정값                                                                   |
| 높이            | `100vh`                  | —                                       | 화면 전체                                                                |
| 배경색          | `rgba(36,36,38,0.80)`    | `theme.colors.gray.a80`                 | 일치                                                                     |
| 테두리          | `rgba(226,230,255,0.10)` | **신규 추가 필요**                      | 기존 `blueWhite.border10`은 `0.05` → `0.10`으로 수정 또는 별도 토큰 추가 |
| backdrop-filter | `blur(40px)`             | `theme.effects.backdropBlur[40]`        | 일치                                                                     |
| z-index         | overlay 레벨             | `theme.zIndex.overlay` (1100)           | 모달(1200)보다 낮게                                                      |

### 3.2 테마 변경 사항

| 파일     | 변경                      | 현재 값                  | 변경 값                  | 비고                                                |
| -------- | ------------------------- | ------------------------ | ------------------------ | --------------------------------------------------- |
| `layout` | `sidebarWidth` 추가       | —                        | `'270px'`                | 신규 토큰                                           |
| `colors` | `blueWhite.border10` 수정 | `rgba(226,230,255,0.05)` | `rgba(226,230,255,0.10)` | 피그마 기준, BottomSheet 제거 후 사이드 이펙트 없음 |

---

## 4. 컴포넌트 상세

### 4.1 Sidebar (루트)

| 속성      | 설명                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `isOpen`  | 사이드바 열림/닫힘 상태                                                        |
| `onClose` | 닫기 콜백                                                                      |
| 위치      | 화면 좌측, 지도 위 오버레이                                                    |
| 배경      | `gray.a80` + `backdropBlur[40]` + `border-right: 1px solid blueWhite.border10` |

### 4.2 Header

- 좌측: "LOKIT" 워드마크 SVG (`lokitWordmark.svg`, 60×14px, `color: gray[0]` 흰색)
- 우측: ✕ 닫기 버튼 (`close.svg`, 20×20px)
- 패딩: `pl: 12px, py: 8px`
- `onClose` 클릭 시 사이드바 닫힘

### 4.3 SearchInput

- 앨범 검색 입력 필드
- placeholder: "앨범을 검색해보세요..."
- 기존 `AlbumGrid`의 검색 로직 재사용 (`Input` 컴포넌트 활용)
- 검색어 입력 시 AlbumList를 필터링

| 속성             | 값                       | 테마 토큰                  |
| ---------------- | ------------------------ | -------------------------- |
| 배경             | `rgba(226,230,255,0.05)` | `colors.blueWhite.bg5`     |
| 패딩             | `px: 12px, py: 10px`     | —                          |
| border-radius    | `12px`                   | —                          |
| 아이콘 크기      | `16px`                   | —                          |
| placeholder 색상 | `#8D8C8F`                | `colors.gray[400]`         |
| 텍스트 스타일    | `body-16-regular`        | `typography.body16Regular` |

### 4.4 Menu

두 개의 메뉴 아이템으로 구성, 아이템 간 gap `4px`:

| 메뉴                   | 아이콘                   | 동작                                        |
| ---------------------- | ------------------------ | ------------------------------------------- |
| **Explore** (탐색)     | `explore.svg` (20×20px)  | `ROUTES.EXPLORE`로 이동                     |
| **NewAlbum** (새 앨범) | `newAlbum.svg` (20×20px) | 앨범 추가 모달 열기 (`onOpenAddAlbumModal`) |

| 속성                  | 값                   | 테마 토큰                                                    |
| --------------------- | -------------------- | ------------------------------------------------------------ |
| 아이템 패딩           | `px: 12px, py: 10px` | —                                                            |
| gap (아이콘 ↔ 텍스트) | `20px`               | —                                                            |
| border-radius         | `12px`               | —                                                            |
| 텍스트                | `body-16-medium`     | `typography.body16Medium`, `colors.text.primary` (`#D3D3D3`) |

### 4.5 AlbumList

- "앨범" 섹션 라벨 표시
- 앨범 목록을 세로 리스트로 렌더링
- SearchInput의 검색어에 따라 필터링
- 기존 `AlbumGrid`의 필터링 로직 재사용 (검색어로 `album.title` 포함 여부 필터링, 메모이제이션 적용)

| 속성        | 값                | 테마 토큰                                                  |
| ----------- | ----------------- | ---------------------------------------------------------- |
| 섹션 패딩   | `px: 12px`        | —                                                          |
| 라벨 텍스트 | `body-14-regular` | `typography.body14Regular`, `colors.gray[500]` (`#7B7B7D`) |
| 라벨 패딩   | `px: 12px`        | —                                                          |

#### 4.5.1 AlbumListItem

> 피그마 컴포넌트명: `List Item (네비게이션용)`

| props         | 타입              | 설명                                                |
| ------------- | ----------------- | --------------------------------------------------- |
| `icon?`       | 컴포넌트/엘리먼트 | 선택적 좌측 아이콘 (전체사진 앨범에 사용)           |
| `title`       | `string`          | 앨범 이름                                           |
| `totalCount?` | `number`          | 사진 개수                                           |
| `showMenu?`   | `boolean`         | 더보기(···) 메뉴 표시 여부 (`menu.svg` 아이콘 사용) |

**스타일 상세 (피그마 기준):**

| 속성                        | 값                       | 테마 토큰                                                    |
| --------------------------- | ------------------------ | ------------------------------------------------------------ |
| 패딩                        | `px: 12px, py: 10px`     | —                                                            |
| gap (아이콘 ↔ 텍스트)       | `20px`                   | —                                                            |
| border-radius               | `12px`                   | —                                                            |
| 제목 텍스트                 | `body-16-medium`         | `typography.body16Medium`, `colors.text.primary` (`#D3D3D3`) |
| 카운트 텍스트               | `body-16-medium`         | `typography.body16Medium`, `colors.gray[400]` (`#8D8C8F`)    |
| hover/pressed/selected 배경 | `rgba(226,230,255,0.08)` | `colors.blueWhite.bg8`                                       |

> 피그마 어노테이션: "좌우측의 아이콘/숫자는 상태에 따라 노출하거나 숨길 수 있습니다"

**전체사진 앨범 (기본 앨범):**

- `blueWhite.bg8` 배경 강조 스타일 상시 적용 (selected 상태)
- `showMenu` = false (더보기 메뉴 없음)
- 항상 목록 최상단에 고정

**사용자 생성 앨범:**

- `showMenu` = true → 더보기(···) 버튼 표시
- 더보기 메뉴: 앨범 이름 변경, 앨범 삭제
- hover/pressed 시 `blueWhite.bg8` 배경 디졸브 효과

### 4.6 My

- 하단 고정 (flex 레이아웃, `margin-top: auto`)
- 상단 구분선: `border-top: 1px solid blueWhite.border10`
- 패딩: `8px`, 하단 여백 `20px`
- 클릭 시 마이페이지(`ROUTES.MYPAGE`)로 이동

| 요소              | 스타일                                                                        | 테마 토큰                                                 |
| ----------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| 프로필 원형       | `44px`, `backdropBlur[25]`, `blueWhite.bg8` 배경, `blueWhite.border10` 테두리 | btn-circle 스타일                                         |
| 프로필 이미지     | `36px`, `border-radius: 999px`                                                | —                                                         |
| 닉네임            | `body-16-medium`                                                              | `typography.body16Medium`, `colors.gray[100]` (`#E8E8E8`) |
| D-day 뱃지 배경   | `rgba(226,230,255,0.08)`, `border-radius: 8px`, `px: 8px, py: 2px`            | `colors.blueWhite.bg8`                                    |
| D-day 하트 아이콘 | `12px`                                                                        | `heart.svg`                                               |
| D-day 텍스트      | `body-15-medium`                                                              | `typography.body15Medium`, `colors.gray[300]` (`#B2B2B4`) |
| 아이템 gap        | `12px` (프로필 ↔ 텍스트 영역), `8px` (닉네임 ↔ 뱃지)                          | —                                                         |

---

## 5. 인터랙티브 컴포넌트 설계

Sidebar 루트가 열림/닫힘 상태, CSS transition 애니메이션, ESC/backdrop 이벤트 핸들링 등으로 클라이언트 사이드 렌더링이 불가피하다.
하위 컴포넌트들도 대부분 상태 관리나 이벤트 핸들링을 필요로 하므로, 전체 트리를 클라이언트에서 렌더링한다.

> **서버 렌더링 최적화 검토**
> 합성(Composition) 패턴으로 정적 컴포넌트를 서버에서 렌더링하여 전달할 수 있으나,
> Sidebar 하위 컴포넌트 대부분이 이벤트 핸들러 또는 상태를 필요로 하므로(SearchInput의 검색어 상태, Menu의 클릭 라우팅, AlbumList의 필터링 등),
> 서버 렌더링으로 분리 가능한 부분이 로고 텍스트 정도에 불과하여 구조 복잡도 대비 실익이 없다고 판단하였다.

| 컴포넌트          | 인터랙션이 필요한 이유                              |
| ----------------- | --------------------------------------------------- |
| **Sidebar**       | 열림/닫힘 상태, CSS transition, ESC/backdrop 이벤트 |
| **SearchInput**   | 검색어 상태 관리, 입력 이벤트                       |
| **AlbumList**     | 메모이제이션 필터링, 클릭 이벤트                    |
| **AlbumListItem** | 더보기 메뉴 토글, 클릭 이벤트                       |
| **My**            | 클릭 이벤트 (라우팅)                                |
| **Header**        | 부모가 인터랙티브이므로 자동 포함                   |
| **Menu**          | 부모가 인터랙티브이므로 자동 포함                   |

---

## 6. 상태 관리

### 6.1 사이드바 열기/닫기

- 홈(지도뷰/격자뷰) 상단 헤더의 **햄버거 메뉴(≡)** 버튼으로 사이드바 열기
- 사이드바 내 **✕ 버튼**으로 닫기
- 사이드바 외부 영역(backdrop) 클릭 시 닫기
- ESC 키로 닫기

### 6.2 기존 BottomSheet 상태와의 관계

기존 `SheetContext` → `ViewContext`로 리네이밍 완료 (`constants/viewContext.ts`).

| 기존 SheetContext | 리네이밍 후 ViewContext | 사이드바 전환 후                                                                                          |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `HOME`            | `HOME`                  | 사이드바 닫힌 상태의 지도뷰/격자뷰                                                                        |
| `ALBUM_LIST`      | `ALBUM_LIST`            | 사이드바 열린 상태 (AlbumList 표시)                                                                       |
| `ALBUM_DETAIL`    | `ALBUM_DETAIL`          | `/album/:id` 라우트 유지. 사이드바에서 앨범 클릭 시 해당 라우트로 이동, 홈 레이아웃 내에서 사진 목록 갱신 |
| `CLUSTER_DETAIL`  | `CLUSTER_DETAIL`        | 유지 (클러스터 상세는 사이드바와 무관)                                                                    |

> `VIEW_CONTEXT_TYPE.ALBUM_LIST`는 사이드바 open 상태로 대체될 수 있음.

### 6.3 검색 상태

- `SearchInput`의 검색어 → `AlbumList` 필터링
- 사이드바 내부에서 로컬 상태로 관리
- 사이드바 닫힐 때 검색어 초기화

---

## 7. 뷰 전환 (지도뷰 ↔ 격자뷰)

피그마 기준 두 가지 메인 뷰가 존재:

| 뷰         | 설명                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| **지도뷰** | 지도 위에 사진 핀 표시, 하단에 "기록 N개" + "격자보기" 플로팅 버튼     |
| **격자뷰** | 전체사진을 격자 그리드로 표시, 상단 헤더에 ≡(사이드바 열기) + 🔔(알림) |

- 격자뷰 헤더 좌측의 **≡ 버튼**이 사이드바 열기 트리거
- 지도뷰에서도 사이드바 접근 가능해야 함

### 7.1 ViewSwitcher 컴포넌트

> 피그마 컴포넌트명: `View Switcher`
> 기존 하단 뷰 전환 바를 대체

지도보기 / 격자보기를 전환하는 pill 형태의 토글 컴포넌트.

| props          | 타입              | 설명         |
| -------------- | ----------------- | ------------ |
| `activeView`   | `'map' \| 'grid'` | 현재 활성 뷰 |
| `onChangeView` | `(view) => void`  | 뷰 전환 콜백 |

**스타일 상세 (피그마 기준):**

| 속성            | 값                                   | 테마 토큰                   |
| --------------- | ------------------------------------ | --------------------------- |
| 높이            | `44px`                               | —                           |
| 내부 패딩       | `4px`                                | —                           |
| border-radius   | `99px` (pill)                        | —                           |
| 배경            | `rgba(226,230,255,0.08)`             | `colors.blueWhite.bg8`      |
| 테두리          | `rgba(226,230,255,0.10)`             | `colors.blueWhite.border10` |
| backdrop-filter | `blur(25px)`                         | `effects.backdropBlur[25]`  |
| 활성 탭 배경    | `#E8E8E8`                            | `colors.gray[100]`          |
| 활성 탭 텍스트  | `#302F32`                            | `colors.gray[900]`          |
| 활성 탭         | 아이콘 + 텍스트 (`body-15-semibold`) | `typography.body15Semibold` |
| 비활성 탭       | 아이콘만 표시, 너비 `36px`           | —                           |

**아이콘:**

- 지도보기: `mapPin.svg` (기존)
- 격자보기: `grid.svg` (신규 추가)

---

## 8. 기존 코드 변경 범위

### 8.1 삭제/대체 대상

| 기존 파일                                                   | 변경                                               |
| ----------------------------------------------------------- | -------------------------------------------------- |
| `components/bottomSheet/BottomSheet.tsx`                    | Sidebar로 대체                                     |
| `components/bottomSheet/BottomSheet.styles.ts`              | Sidebar 스타일로 대체                              |
| `components/bottomSheet/_hooks/useBottomSheetController.ts` | 삭제 (드래그 로직 불필요)                          |
| `components/bottomSheet/constants.ts`                       | `constants/viewContext.ts`로 이동 및 리네이밍 완료 |
| `components/bottomSheet/albumRow/AlbumRow.tsx`              | AlbumListItem으로 대체                             |
| `components/bottomSheet/albumGrid/AlbumGrid.tsx`            | 검색/필터 로직만 Sidebar로 이동                    |
| `components/bottomSheet/HomeEmptyState.tsx`                 | 격자뷰 빈 상태로 이동 또는 유지                    |

### 8.2 신규 생성

| 파일 경로 (예상)                              | 설명                                |
| --------------------------------------------- | ----------------------------------- |
| `components/sidebar/Sidebar`                  | 사이드바 루트 컴포넌트 (인터랙티브) |
| `components/sidebar/Sidebar.styles`           | 스타일                              |
| `components/sidebar/SidebarHeader`            | Header (LOKIT 로고 + 닫기)          |
| `components/sidebar/SidebarMenu`              | Menu (Explore + NewAlbum)           |
| `components/sidebar/AlbumList`                | 앨범 리스트 + 검색 입력             |
| `components/sidebar/AlbumListItem`            | 앨범 리스트 아이템                  |
| `components/sidebar/SidebarMy`                | 하단 프로필 영역                    |
| `components/viewSwitcher/ViewSwitcher`        | 지도뷰 ↔ 격자뷰 전환 토글           |
| `components/viewSwitcher/ViewSwitcher.styles` | ViewSwitcher 스타일                 |

### 8.3 수정 대상

| 파일                                        | 변경 내용                                                   |
| ------------------------------------------- | ----------------------------------------------------------- |
| `app/_components/MapRoute.tsx`              | BottomSheet → Sidebar 교체, `isSidebarOpen` 상태 추가       |
| `app/_components/MapRouteBottomSection.tsx` | 사이드바 전환에 맞게 리팩토링 또는 제거                     |
| `app/_components/MapRouteHeader.tsx`        | 격자뷰 헤더에 ≡ 버튼 추가                                   |
| `app/page.styles.ts`                        | 레이아웃 스타일 조정                                        |
| `theme/colors.ts`                           | `blueWhite.border10` 값을 `rgba(226,230,255,0.10)`으로 수정 |
| `theme/layout.ts`                           | `sidebarWidth: '270px'` 추가                                |

---

## 9. 애니메이션

- **열기**: 좌측에서 슬라이드 인 (`transform: translateX(-100%) → translateX(0)`)
- **닫기**: 좌측으로 슬라이드 아웃 (`transform: translateX(0) → translateX(-100%)`)
- **Backdrop**: 열릴 때 fade in (`opacity: 0 → 1`), 닫힐 때 fade out
- **transition**: `0.3s ease`

---

## 10. 접근성

- 사이드바 열릴 때 포커스 트랩 (선택적)
- ESC 키로 사이드바 닫기
- 적절한 `aria-label` 부여
- `<aside>` 시맨틱 태그 사용
