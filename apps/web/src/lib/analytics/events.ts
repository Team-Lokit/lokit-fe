/**
 * 이벤트 정의서(LOKIT_이벤트정의서.csv) 기반 타입 정의.
 * 새 이벤트 추가 시 CSV를 먼저 갱신하고 이 파일에 반영한다.
 */

export type ViewMode = 'map' | 'grid';
export type PhotoDetailSource = 'home_map' | 'home_grid' | 'album_detail';
export type PhotoPickerSource = 'home' | 'album_detail';
export type LoginMethod = 'kakao' | 'apple';
export type LoginReferrer = 'organic' | 'deeplink';
export type InviteMethod = 'link' | 'code';
export type CoupleConnectErrorType = 'invalid_code' | 'expired' | 'already_connected';
export type PhotoUploadErrorType = 'network' | 'server' | 'timeout';

export type CoupleConnectErrorCode = 'INVITE_001' | 'INVITE_002' | 'COUPLE_001';

export const COUPLE_CONNECT_ERROR_TYPE_BY_CODE: Record<
  CoupleConnectErrorCode,
  CoupleConnectErrorType
> = {
  INVITE_001: 'invalid_code',
  INVITE_002: 'expired',
  COUPLE_001: 'already_connected',
};

export type EventMap = {
  // 전역
  app_open: {
    is_first_open: boolean;
    days_since_last_open: number;
  };
  app_background: {
    session_duration_ms: number;
    screens_viewed: number;
    photos_uploaded: number;
  };
  // TODO: days_since_signup, days_since_couple_connect는 클라이언트가 알 수 없어 제외
  first_photo_upload: Record<string, never>;

  // 로그인
  screen_view_login: {
    referrer: LoginReferrer;
  };
  login_success: {
    is_new_user: boolean;
    login_method: LoginMethod;
  };
  login_fail: {
    error_code: string;
    error_message: string;
  };

  // 프로필 설정
  screen_view_profile_setup: {
    is_first_setup: boolean;
  };
  profile_setup_complete: {
    has_profile_image: boolean;
  };

  // 커플 연결
  couple_connect_success: {
    invite_method: InviteMethod;
    // TODO: days_since_signup은 클라이언트가 알 수 없어 제외
  };
  couple_connect_fail: {
    error_type: CoupleConnectErrorType;
  };

  // 홈
  screen_view_home: {
    view_mode: ViewMode;
    total_records: number;
  };
  click_view_mode_switch: {
    from_mode: ViewMode;
    to_mode: ViewMode;
  };

  // 사이드바
  click_sidebar_open: {
    total_records: number;
  };
  click_sidebar_new_album: Record<string, never>;
  click_sidebar_album: {
    album_id: string;
    album_name: string;
    album_position: number;
  };
  screen_view_album_detail: {
    album_id: string;
    album_name: string;
    record_count: number;
    view_mode: ViewMode;
  };

  // 앨범 생성
  modal_view_album_create: Record<string, never>;
  click_album_create_cancel: {
    had_input: boolean;
  };
  album_create_success: {
    album_id: string;
    album_name: string;
    total_album_count: number;
  };

  // 사진 업로드 / 정보 기입
  screen_view_photo_picker: {
    source: PhotoPickerSource;
  };
  select_photo: {
    photo_count: number;
    source: PhotoPickerSource;
  };
  screen_view_photo_info: {
    photo_count: number;
    has_metadata_location: boolean;
  };
  click_location_tag: {
    has_auto_location: boolean;
  };
  click_memo_input: Record<string, never>;
  click_memo_confirm: {
    memo_length: number;
  };
  click_memo_cancel: {
    had_input: boolean;
    memo_length: number;
  };
  click_album_select: Record<string, never>;
  click_photo_upload_submit: {
    photo_count: number;
    has_memo: boolean;
    has_location: boolean;
    has_album: boolean;
    album_id?: string;
  };
  click_photo_upload_close: {
    photo_count: number;
    has_memo: boolean;
    has_location: boolean;
    has_album: boolean;
  };
  photo_upload_success: {
    photo_id: string;
    photo_count: number;
    // TODO: is_first_upload은 클라이언트가 정확히 알 수 없어 제외
  };
  photo_upload_fail: {
    error_type: PhotoUploadErrorType;
    photo_count: number;
  };

  // 마이페이지
  click_disconnect_couple: {
    couple_days: number;
    total_photos: number;
  };
  click_withdraw: {
    couple_days: number;
    total_photos: number;
  };

  // 지도 / 격자
  click_photo_cluster: {
    cluster_count: number;
    location_name: string;
  };
  click_map_photo_pin: {
    photo_id: string;
    location_name: string;
  };
  click_grid_photo_thumb: {
    photo_id: string;
    photo_date: string;
  };
  screen_view_photo_detail: {
    photo_id: string;
    source: PhotoDetailSource;
    has_memo: boolean;
    // TODO: 댓글 기능 구현 후 comment_count 추가 예정
  };
};

export type EventName = keyof EventMap;
export type EventParams<E extends EventName> = EventMap[E];

export type UserProperties = {
  user_id?: string;
  couple_id?: string;
  signup_at?: string;
  couple_connected_at?: string;
};
