/**
 * 지도 클러스터링 설정 상수
 */
export const MAP_CLUSTERING_CONFIG = {
  /** 클라이언트 클러스터링 시작 줌 레벨 (이 레벨 이상에서 클라이언트 클러스터링 사용) */
  CLIENT_CLUSTERING_MIN_ZOOM: 15,
  /** 클라이언트 클러스터 판별용 prefix */
  CLIENT_CLUSTER_PREFIX: 'client_',
  /** Supercluster 최대 줌 레벨 */
  SUPERCLUSTER_MAX_ZOOM: 20,
  /** Supercluster 클러스터 반지름 (픽셀) */
  SUPERCLUSTER_RADIUS: 28,
  /** Supercluster 최소 포인트 수 */
  SUPERCLUSTER_MIN_POINTS: 2,
} as const;

/**
 * 바운딩박스 기반 줌 레벨 계산 상수
 * 백엔드는 화면에 보이는 범위를 기준으로 확대된 범위를 제공합니다.
 * 이 상수들은 실제 필요한 줌 레벨을 계산할 때 이를 보정하기 위해 사용됩니다.
 */
export const BBOX_ZOOM_CALCULATION = {
  /** 백엔드 경도(가로) 확대 비율 */
  BACKEND_LNG_EXPANSION_RATIO: 3.3,
  /** 백엔드 위도(세로) 확대 비율 */
  BACKEND_LAT_EXPANSION_RATIO: 3,
  /** Mapbox 줌 레벨 계산 시 적용 팩터 */
  ZOOM_LEVEL_ADJUSTMENT_FACTOR: 2.5,
  /** 범위를 계산할 수 없을 때 기본 줌 레벨 */
  DEFAULT_ZOOM: 15,
} as const;

/**
 * 행정구역 영역 설정
 * 백엔드 /map/me v2 응답의 clusterId prefix 와 경계 파일 경로를 매핑한다.
 * - 줌 < 8: 시·도 / 8 ≤ 줌 < 12: 시·군·구 / 12 ≤ 줌 < 15: 읍·면·동 / 줌 ≥ 15: 개별 사진
 */
export const MAP_REGION_CONFIG = {
  /** /map/me 행정구역 클러스터 응답 버전 헤더 */
  API_VERSION: '2.0',
  /** clusterId prefix → 구역 단위 */
  CLUSTER_PREFIX: {
    sd_: 'sido',
    sgg_: 'sgg',
    emd_: 'emd',
  },
  /** 경계 GeoJSON 경로 (public/geo, scripts/build-region-boundaries.mjs 로 생성) */
  BOUNDARY_PATH: {
    sido: '/geo/sido.json',
    sgg: '/geo/sgg.json',
    emd: (sidoCode: string) => `/geo/emd/${sidoCode}.json`,
  },
} as const;
