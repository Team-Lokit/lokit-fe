# Analytics 구현 가이드 (GA4 via GTM + Mixpanel)

`LOKIT_이벤트정의서.csv` 기반으로, GA4(GTM 경유)와 Mixpanel을 동시에 트래킹하는 구조를 도입한다.

---

## 1. 목표

- **단일 진입점**: 컴포넌트에서는 `track('event_name', params)` 한 번만 호출하면 GTM과 Mixpanel 양쪽으로 자동 전송
- **타입 안전**: 이벤트명·매개변수 오타/누락을 컴파일 타임에 차단 (이벤트 정의서가 곧 타입)
- **공통 속성 자동 첨부**: `user_id`, `couple_id`, `days_since_signup` 등은 로그인/연결 시점에 한 번 set → 모든 이벤트에 자동 포함
- **로컬 디버깅 용이**: dev 환경에서 console.log로 발송 내역 확인 가능

---

## 2. 기술 스택 / 의존성

| 항목              | 선택                                               | 비고                                        |
| ----------------- | -------------------------------------------------- | ------------------------------------------- |
| GA4 연동          | **GTM 경유**                                       | dataLayer.push만 사용, GA SDK 직접 임베드 X |
| Mixpanel          | `mixpanel-browser`                                 | 공식 SDK, autocapture + 세션 리플레이 100%  |
| GTM 스크립트 로딩 | `next/script` (`afterInteractive`)                 | 기존 카카오 SDK / Beusable 패턴과 동일      |
| 환경변수          | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_MIXPANEL_TOKEN` | 누락 시 트래킹 비활성 (앱은 정상 동작)      |

설치:

```bash
pnpm --filter web add mixpanel-browser
pnpm --filter web add -D @types/mixpanel-browser
```

### 발급된 식별자 (개발 환경)

```bash
# apps/web/.env.local
NEXT_PUBLIC_GTM_ID=GTM-5MBK7NL9
NEXT_PUBLIC_MIXPANEL_TOKEN=106cd620e42b1e97f4f396453ea3aed4
```

> Mixpanel 브라우저 토큰과 GTM 컨테이너 ID는 클라이언트에 노출되는 공개 식별자다. 그래도 운영/스테이징/개발 분리를 위해 ENV로 관리한다. 운영용 토큰은 별도 발급 후 Netlify 환경변수에 등록.

---

## 3. 디렉터리 구조

```
apps/web/src/
├── lib/
│   └── analytics/
│       ├── index.ts            # track / identify / setUserProperties 공개 API
│       ├── events.ts           # 이벤트 정의서 → TS 타입 (EventMap)
│       ├── gtm.ts              # GTM dataLayer 어댑터
│       ├── mixpanel.ts         # Mixpanel 어댑터
│       ├── superProperties.ts  # 세션 공통 속성 보관소
│       └── screenViewMap.ts    # pathname → screen_view_* 매핑
├── components/
│   └── analytics/
│       ├── GtmScript.tsx       # GTM 스니펫 (head)
│       ├── GtmNoScript.tsx     # GTM noscript (body 최상단)
│       └── AnalyticsProvider.tsx # init(Mixpanel) + 화면뷰 자동 발송
└── hooks/
    └── useTrack.ts             # 컴포넌트용 훅 (선택)
```

---

## 4. 작업 단계

### Phase 0 — 사전 준비 (개발 외)

- [x] GTM 컨테이너 생성 → `GTM-5MBK7NL9`
- [x] Mixpanel 프로젝트 생성 → 토큰 `106cd620e42b1e97f4f396453ea3aed4`
- [ ] GA4 속성 생성, GTM 워크스페이스에서 GA4 Configuration 태그 등록
- [ ] `.env.local` / Netlify 환경변수에 ENV 등록 (운영 토큰은 별도 발급)

### Phase 1 — 인프라 셋업

1. **이벤트 타입 정의** ([events.ts](../src/lib/analytics/events.ts))
   - CSV의 `이벤트` 컬럼을 키로, `매개변수`를 값 객체로 하는 `EventMap` 타입 작성
   - 매개변수 값 예시(`"organic" / "deeplink"`)는 리터럴 유니온으로
2. **GTM 어댑터** ([gtm.ts](../src/lib/analytics/gtm.ts))
   - `window.dataLayer` 초기화
   - `pushEvent(name, params)` → `dataLayer.push({ event, event_params })`
3. **Mixpanel 어댑터** ([mixpanel.ts](../src/lib/analytics/mixpanel.ts))
   - `init(token, { autocapture: true, record_sessions_percent: 100 })`
   - `track(name, params)`, `identify(id)`, `register(props)`, `reset()`
   - 토큰 없으면 no-op
   - **autocapture**: 클릭/페이지뷰/폼 제출 등 일반 인터랙션 자동 수집
   - **record_sessions_percent: 100**: 모든 세션을 세션 리플레이로 녹화 (베타 단계 동안만 100%, 사용자 증가 시 샘플링 조정)
4. **공개 API** ([index.ts](../src/lib/analytics/index.ts))
   - `track<E extends keyof EventMap>(event: E, params: EventMap[E])`
   - 두 어댑터에 fan-out, dev 환경에서 console.debug
5. **GTM 스크립트 임베드** — [layout.tsx](../src/app/layout.tsx)
   - `<head>`에 `GtmScript`, `<body>` 최상단에 `GtmNoScript`
6. **AnalyticsProvider** — [providers.tsx](../src/app/providers.tsx) 안쪽에 추가
   - 마운트 시 Mixpanel init
   - `usePathname` 변경 감지 → `screenViewMap` 매칭 → `track('screen_view_*')` 자동 발송

#### 구현 스니펫 참고

**GTM `<head>` 스크립트** — `next/script` `beforeInteractive` 또는 `afterInteractive`로 감싸 사용

```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-5MBK7NL9');
</script>
<!-- End Google Tag Manager -->
```

**GTM `<body>` 직후 noscript** — Next.js App Router에서는 `layout.tsx`의 `<body>` 첫 자식으로 삽입

```html
<!-- Google Tag Manager (noscript) -->
<noscript
  ><iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-5MBK7NL9"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  ></iframe
></noscript>
<!-- End Google Tag Manager (noscript) -->
```

**Mixpanel 초기화** — 클라이언트 컴포넌트(`AnalyticsProvider`) 내부에서 1회만 실행

```ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  autocapture: true,
  record_sessions_percent: 100,
});
```

> ID/토큰은 ENV에서 주입한다. 위 스니펫의 하드코딩된 값은 **참고용**이며, 코드에는 `process.env.NEXT_PUBLIC_GTM_ID` / `process.env.NEXT_PUBLIC_MIXPANEL_TOKEN`을 사용한다.

### Phase 2 — 도메인 이벤트 연결 (CSV 기준)

각 이벤트의 발송 위치를 CSV 정의에 따라 코드에 삽입한다.

#### 로그인 / 온보딩 (`apps/web/src/app/login`, `onboarding`)

- [ ] `screen_view_login` — 로그인 페이지 마운트
- [ ] `login_success` — 카카오 로그인 API 성공 (`is_new_user`, `login_method: 'kakao'`)
  - 성공 시점에 `identify(user_id)` + super property `user_id` 등록
- [ ] `login_fail` — 로그인 실패
- [ ] `screen_view_profile_setup`
- [ ] `profile_setup_complete`

#### 커플 연결 (`apps/web/src/app/sync`, `reconnect`)

- [ ] `couple_connect_success` — super property `couple_id`, `days_since_signup` 등록
- [ ] `couple_connect_fail`

#### 홈 / 지도 / 격자 (`apps/web/src/app/page.tsx`, `explore`)

- [ ] `screen_view_home`
- [ ] `click_add_photo_fab`
- [ ] `click_view_mode_switch`
- [ ] `click_photo_cluster`
- [ ] `click_map_photo_pin`
- [ ] `click_grid_photo_thumb`
- [ ] `screen_view_photo_detail`

#### 사이드바 / 앨범 (`apps/web/src/app/album`, `(.)album`)

- [ ] `click_sidebar_open`
- [ ] `click_sidebar_new_album`
- [ ] `click_sidebar_album`
- [ ] `screen_view_album_detail`
- [ ] `modal_view_album_create`
- [ ] `click_album_create_cancel`
- [ ] `album_create_success`

#### 사진 업로드 (`apps/web/src/app/photo`)

- [ ] `screen_view_photo_picker`
- [ ] `select_photo`
- [ ] `screen_view_photo_info`
- [ ] `click_location_tag`, `click_memo_input`, `click_memo_confirm`, `click_memo_cancel`, `click_album_select`
- [ ] `click_photo_upload_submit`
- [ ] `click_photo_upload_close`
- [ ] `photo_upload_success`
- [ ] `photo_upload_fail`
- [ ] `first_photo_upload` — 유저 생애 1회. 서버 응답에 플래그가 있어야 함 (없으면 클라이언트 로컬스토리지 보조)

#### 마이페이지 (`apps/web/src/app/mypage`)

- [ ] `click_disconnect_couple`
- [ ] `click_withdraw`

#### 전역 (RN bridge에서 발송)

`app_open`, `app_background`, `first_photo_upload(생애 최초 판정)`은 **웹에서 자동 발송하지 않는다.**
네이티브 라이프사이클은 웹의 `visibilitychange`로는 정확히 잡을 수 없어 (탭 전환·새로고침과 구분 불가),
정확한 매개변수 (`is_first_open`, `days_since_last_open`, `session_duration_ms` 등)를 RN 측에서 산정해 보내는 방식으로 통일한다.

- [ ] RN → 웹: `window.lokitTrack(event, params)` 호출
  - RN이 `WebView.injectJavaScript()`로 주입
  - 웹은 [AnalyticsProvider](../src/components/analytics/AnalyticsProvider.tsx) 마운트 시 `window.lokitTrack`을 노출
- [ ] RN 측 발송 대상:
  - `app_open` — 앱 포그라운드 진입 시 (콜드 스타트 + 백그라운드 복귀)
  - `app_background` — 앱 백그라운드 전환 시
  - 그 외 정의서 상 명시적으로 RN 라이프사이클이 필요한 이벤트

**브리지 호출 예시 (RN 쪽)**

```ts
// RN
webViewRef.current?.injectJavaScript(`
  window.lokitTrack && window.lokitTrack('app_open', {
    is_first_open: ${isFirstOpen},
    days_since_last_open: ${daysSinceLastOpen}
  });
  true;
`);
```

웹 단독(브라우저 직접 접근) 환경에서는 `app_open` 계열이 발송되지 않는다 — 의도된 동작.

### Phase 3 — GTM 워크스페이스 설정

GTM UI에서 다음을 구성:

1. **변수**: Data Layer Variable `event_params` (또는 자식 변수 `event_params.is_new_user` 등)
2. **트리거**: 이벤트 정의서의 각 이벤트명마다 "Custom Event" 트리거 생성
   - 또는 정규식 트리거 1개로 묶고 GA4 태그에서 `{{Event}}` 사용
3. **태그**: GA4 Event 태그
   - Event Name: `{{Event}}` (또는 고정)
   - Event Parameters: 자주 쓰는 키들을 미리 매핑 (e.g. `is_new_user`, `photo_count`)

### Phase 4 — 검증

- [ ] dev 환경 console에 `[analytics] track ...` 로그 확인
- [ ] **GTM Preview 모드**로 dataLayer 이벤트 흐름 확인
- [ ] **GA4 DebugView**에서 실시간 이벤트 수신 확인
- [ ] **Mixpanel Live View**에서 실시간 이벤트 수신 확인
- [ ] 이벤트 정의서의 모든 행과 실제 발송 매핑 1:1 점검 (체크박스)

---

## 5. 사용 예시

```tsx
// 컴포넌트에서
import { track } from '@/lib/analytics';

<Button
  onClick={() => {
    track('click_add_photo_fab', {
      total_records: photos.length,
      view_mode: viewMode,
    });
    openPhotoPicker();
  }}
>
  +
</Button>;
```

```tsx
// 로그인 성공 시
import { track, identify, setUserProperties } from '@/lib/analytics';

const onLoginSuccess = (res: LoginResponse) => {
  identify(res.userId);
  setUserProperties({ user_id: res.userId });
  track('login_success', {
    is_new_user: res.isNewUser,
    login_method: 'kakao',
  });
};
```

---

## 6. 명명 / 컨벤션 규칙

- 이벤트명: `snake_case` (정의서 그대로)
- 매개변수 키: `snake_case`
- 화면뷰 이벤트: `screen_view_<화면명>` 접두사 고정
- 클릭 이벤트: `click_<대상>` 접두사
- 모달 노출: `modal_view_<모달명>`
- 성공/실패: `_success` / `_fail` 접미사
- 새로운 이벤트가 필요하면 **먼저 이벤트 정의서를 업데이트**한 뒤 코드에 반영

---

## 7. 개인정보 / 운영 주의

- 회원 탈퇴 시 Mixpanel `reset()` 호출

---

## 8. 마일스톤 (예시)

| 주차 | 내용                                  |
| ---- | ------------------------------------- |
| W1   | Phase 0 + Phase 1 (인프라)            |
| W2   | Phase 2 — 로그인/커플연결/홈          |
| W3   | Phase 2 — 사진 업로드/앨범/마이페이지 |
| W4   | Phase 3 (GTM 설정) + Phase 4 (검증)   |

---

## 9. 알려진 제약 / 후속 보강 항목

도메인 이벤트 연결 과정에서 식별된 정확도/구조 이슈. 백엔드 협의 또는 후속 작업으로 보강한다.

### 로그인 / 온보딩

- **`is_new_user` 추정 한계**
  - 현재: `/sync` 시점에 `coupleStatus === 'NOT_COUPLED'`이면 `true`로 간주
  - 한계: 실제 신규 가입자와 "미연결 상태로 재로그인한 기존 유저"를 구분하지 못함
  - 보강안: 백엔드가 OAuth 콜백 리다이렉트 시 `?new=true` 같은 신호를 추가하거나, `/users/me` 응답에 `isNewUser` 플래그 포함
- **`identify(user_id)` 미연동**
  - 현재: 로그인 성공 시 Mixpanel `identify()`를 호출하지 않아 distinct_id가 익명 상태로 유지됨
  - 영향: 동일 유저의 다중 디바이스 / 로그아웃 후 재로그인 추적이 끊김, 퍼널 분석 정확도 저하
  - 보강안: 로그인 직후 또는 첫 인증 API 호출 결과에서 user_id를 얻는 시점에 `identify(user_id)` + `setSuperProperties({ user_id })` 호출. `/users/me`에 user_id 필드 노출이 필요
- **`login_fail` 트리거 가정**
  - 현재: 백엔드가 OAuth 실패 시 `/login?error=AUTH_001&error_message=user_cancelled` 형식으로 리다이렉트하는 것을 전제
  - 한계: 실제 백엔드 동작이 다르면 발송되지 않음
  - 보강안: 백엔드 OAuth 실패 응답 규약 확정 후 쿼리 키 / 값 매핑 점검
- **`screen_view_login`의 `referrer` 정확도**
  - 현재: `document.referrer` 호스트 비교 (외부 도메인 → `deeplink`, 그 외 → `organic`)
  - 한계: RN 웹뷰에서는 referrer가 비어있어 항상 `organic`으로 잡힘. 카카오 공유링크 등 진짜 deeplink 식별 불가
  - 보강안: RN bridge에서 진입 경로(딥링크 URL)를 명시적으로 전달하거나, URL UTM 파라미터 활용
- **`is_first_setup` 추정**
  - 현재: `OnboardingContext.completedSteps.profile`이 false면 first_setup으로 간주
  - 한계: sessionStorage 기반이라 새 탭/세션이면 항상 첫 설정으로 잡힘. 재온보딩(끊고 재연결) 케이스 구분 불완전
  - 보강안: 서버 측 프로필 존재 여부로 판정 (`/my-page` 응답 활용)

### 커플 연결

- **`days_since_signup` 항상 0**
  - 현재: `couple_connect_success` 발송 시 `days_since_signup: 0`으로 하드코딩
  - 한계: 클라이언트가 회원 가입 일자를 알 수 없음 (`MyPageResponse`에 가입일 필드 부재). 신규 가입 직후 연결은 0이 맞지만, 재연결(끊고 다시) 케이스는 부정확
  - 보강안: 백엔드 `/my-page` 또는 `/users/me` 응답에 `signupAt` / `createdAt` 필드 추가, 로그인 시점에 super property로 등록 후 차감
- **inviter 측 `couple_connect_success` 트리거 정확도**
  - 현재: `/onboarding/connect`에서 3초 폴링으로 `isCoupled` false→true 전환을 감지해 발송 (`invite_method: 'link'`)
  - 한계: 폴링 간격만큼 지연. 사용자가 페이지를 빨리 떠나면 누락 가능. 또한 카카오 공유 외 경로(예: 단순 코드 복사 후 구두 전달)도 'link'로 잡힘
  - 보강안: 서버 측 웹훅/소켓으로 즉시 알림. 'link' vs 'code' 구분이 inviter/joiner 역할 구분 의도라면 필드명 자체 재검토 권장
- **`couple_connect_fail` 에러 코드 매핑**
  - 현재: `INVITE_001` → `invalid_code`, `INVITE_002` → `expired`, `COUPLE_001` → `already_connected`. 매핑 외 코드는 모두 `invalid_code`로 폴백
  - 한계: 백엔드가 새 에러 코드를 추가해도 자동으로 분류되지 않음
  - 보강안: 신규 에러 코드 추가 시 [verify/page.tsx](../src/app/onboarding/verify/page.tsx)의 `ERROR_TYPE_BY_CODE` 매핑 갱신

### 홈 / 지도 / 격자

- **`location_name` 입도(粒度) 불일치**
  - 현재: 클러스터/핀 클릭 시 [MapRoute](../src/app/_components/MapRoute.tsx) 헤더에 표시되는 `address`(도로명 주소)를 그대로 사용
  - 한계: 정의서 예시는 `"서울특별시"` / `"섭지코지"` 같은 행정동·명소 단위인데, 실제 발송 값은 도로명 주소(예: `"서울 강남구 테헤란로 123"`)라 더 구체적임. 분석 시 동일 위치가 여러 값으로 흩어짐
  - 보강안: 핀/클러스터 좌표 → 행정구역 역지오코딩으로 추상화하거나, 백엔드가 `locationName` 필드를 핀 응답에 포함
- **`comment_count` 항상 0**
  - 현재: `screen_view_photo_detail` 발송 시 `comment_count: 0`으로 하드코딩
  - 한계: 댓글 기능이 2차 MVP라 응답에 필드가 없음
  - 보강안: 댓글 API/필드 추가 시 [photo/[photoId]/page.tsx](../src/app/photo/[photoId]/page.tsx)의 발송 로직에서 실제 카운트 사용
- **`source` 쿼리 파라미터 유실**
  - 현재: `/photo/[id]?source=home_map|home_grid|album_detail` 형태로 진입 경로 전달. 누락 시 `'home_map'`로 폴백
  - 한계: 외부에서 직접 URL 접근, `router.back()` 이후 재진입, 슬라이더 좌우 이동 등 정상 흐름에서도 source가 소실됨
  - 보강안: sessionStorage에 직전 source 보관 + 쿼리 양쪽 사용. 또는 referrer 기반 추정
- **`screen_view_home` 발송 시점 지연**
  - 현재: `totalHistoryCount`이 처음 정의되는 시점(=홈 데이터 첫 로드 완료)에 발송
  - 한계: 진짜 페이지 진입 순간보다 데이터 로드 시간만큼 늦음. 로드 실패 시 영구 미발송
  - 보강안: 마운트 즉시 `total_records: 0` 우선 발송 + 데이터 로드 후 user property 갱신, 또는 별도 `screen_view_home_ready` 분리

### 사이드바 / 앨범

- **`click_album_create_cancel` 트리거 범위**
  - 현재: 모달 `onClose` 공유 핸들러에서 발송 (성공이 아닌 모든 닫기)
  - 한계: 정의서는 "취소 버튼 탭 시"이지만 백드롭 클릭·Escape 키도 cancel로 분류됨
  - 보강안: 닫기 트리거 종류를 구분 (예: `close_method` 매개변수 추가) 또는 백드롭/Escape는 별도 이벤트로 분리
- **`click_sidebar_album` `album_position` 의미 모호**
  - 현재: 사이드바의 전체 앨범 리스트(`mergedAlbumList`) 기준 인덱스를 그대로 사용
  - 한계: 검색어가 있어 필터링된 상태에서 클릭해도 전체 목록 기준 인덱스가 사용됨. "사용자가 본 위치"와 다를 수 있음
  - 보강안: 정의서의 의도가 "원본 목록 순번"이라면 현재 구현이 맞음. "사용자가 본 위치"라면 필터링된 리스트의 인덱스 사용으로 변경 필요 — 정의서 작성자 확인 필요

### 사진 업로드

- **`screen_view_photo_picker` 미발송**
  - 현재: 웹은 FAB → 파일 다이얼로그 → `/photo/add/note` 직행이라 별도 picker 화면이 없음
  - 한계: 정의서의 "기기 사진 선택 화면 진입 시" 트리거에 정확히 대응되는 UI가 웹에 없음. RN 갤러리 뷰는 별도
  - 보강안: RN 갤러리 뷰 도입 시 해당 시점에 발송. 또는 정의서에서 웹은 N/A로 명시
- **`photo_count` 항상 1**
  - 현재: `usePhotoSelect`가 `input.multiple = false`로 단일 선택만 허용
  - 한계: `select_photo`/`screen_view_photo_info`/`click_photo_upload_*`/`photo_upload_*` 모두 photo_count가 항상 1
  - 보강안: 다중 선택 도입 시 자연스럽게 정정. 현재 단일 선택은 의도된 제약
- **`days_since_signup` / `days_since_couple_connect` 항상 0** (`first_photo_upload`)
  - 현재: 클라이언트가 가입일·연결일 정보를 알 수 없어 0으로 발송
  - 한계: 신규 가입 직후 첫 업로드는 0이 맞지만, 가입 후 시간이 지나서 업로드한 경우 부정확
  - 보강안: 서버가 `signupAt`·`coupleConnectedAt`를 응답에 포함 → 로그인/연결 시점에 super property로 등록 후 차감
- **`photo_upload_fail.error_type` 분류 정확도**
  - 현재: [PendingPhotosContext](../src/stores/pendingPhotos/PendingPhotosContext.tsx)의 `classifyUploadError`가 에러 메시지/타입 휴리스틱으로 `network`/`server`/`timeout` 분류
  - 한계: 휴리스틱이라 잘못 분류될 수 있음 (예: 5xx HTTP 에러를 `server`로 잡아내려면 fetch 응답을 직접 확인해야 함)
  - 보강안: 서버 응답이 표준 에러 형식이면 `error.code` 기반으로 정확히 매핑
- **`is_first_upload` 판정 범위**
  - 현재: `localStorage` 키(`lokit:firstUploadDone`)로 판정
  - 한계: 디바이스/브라우저가 바뀌면 첫 업로드로 다시 잡힘. 시크릿 모드에서도 동일 이슈
  - 보강안: 서버에서 "이 유저가 처음 업로드하는지" 응답에 포함하거나, 첫 업로드 직후 user property로 영구 마킹
- **`click_memo_cancel` 트리거 범위**
  - 현재: [useMemoModal](../src/app/photo/add/note/_hooks/useMemoModal.ts)의 `closeModal`에서 발송 (submit이 아닌 경우)
  - 한계: 정의서는 "취소 버튼 탭 시"이지만 백드롭/Escape에서도 발송됨 (앨범 생성 cancel과 동일 이슈)
  - 보강안: 닫기 트리거 종류 구분 필요
