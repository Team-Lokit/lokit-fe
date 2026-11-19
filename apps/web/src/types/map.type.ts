export interface LocationState {
  latitude: number;
  longitude: number;
  zoom: number;
}

/** 행정구역 표시 단위 (시·도 / 시·군·구 / 읍·면·동) */
export type RegionLevel = 'sido' | 'sgg' | 'emd';

export interface MapPin {
  id: number;
  albumId: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  imageCount: number;
  clusterId?: string;
  isCluster: boolean;
  /** 행정구역 클러스터인 경우 구역 단위 */
  regionLevel?: RegionLevel;
  /** 행정구역 코드 (clusterId 에서 prefix 를 뺀 값. 예: sgg_41110 → 41110) */
  regionCode?: string;
  /** 행정구역 이름 */
  regionName?: string;
}
