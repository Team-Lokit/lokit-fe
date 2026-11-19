import { MAP_REGION_CONFIG } from '@/constants/map';
import type { RegionLevel } from '@/types/map.type';

type Position = [number, number];
type Ring = Position[];
type PolygonCoords = Ring[];

export type RegionGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoords }
  | { type: 'MultiPolygon'; coordinates: PolygonCoords[] };

export interface RegionFeature {
  type: 'Feature';
  properties: { code: string };
  geometry: RegionGeometry;
}

export interface RegionFeatureCollection {
  type: 'FeatureCollection';
  features: RegionFeature[];
}

/**
 * 화면 렌더링을 위해 미리 투영해 둔 행정구역
 *
 * SVG 좌표 정밀도(float32) 문제를 피하기 위해
 * 메르카토르 월드 좌표를 구역별 원점(origin) 기준 로컬 좌표로 바꾸고 LOCAL_SCALE 만큼 확대해 둔다.
 * 화면 변환은 매 프레임 JS(double)에서 계산한 matrix 하나로 처리한다.
 */
export interface ProjectedRegion {
  code: string;
  /** 월드 좌표 기준 원점 */
  origin: Position;
  /** 로컬 좌표 SVG path */
  path: string;
  /** 사진을 채울 기준 사각형 (로컬 좌표). 멀리 떨어진 작은 섬은 제외하고 계산 */
  imageRect: { x: number; y: number; width: number; height: number };
  /** 클릭 판정용 원본 경위도 폴리곤 */
  polygons: PolygonCoords[];
  /** 클릭 판정 사전 필터용 경위도 bbox [west, south, east, north] */
  bbox: [number, number, number, number];
}

/** 2x3 아핀 행렬 (SVG matrix(a b c d e f) 와 동일한 순서) */
export type Affine = [number, number, number, number, number, number];

/** 월드 좌표 → 로컬 좌표 확대 배율 */
export const LOCAL_SCALE = 10000;
/** 메르카토르 월드 크기 (줌 0 기준, 단위는 의미 없음. 화면 변환은 map.project 로 역산) */
const WORLD_SIZE = 512;
/** 사진 기준 사각형 계산 시 무시할 섬 크기 (가장 큰 폴리곤 면적 대비) */
const MINOR_POLYGON_AREA_RATIO = 0.1;

const MAX_LATITUDE = 85.051129;

export const lngLatToWorld = (lng: number, lat: number): Position => {
  const clampedLat = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat));
  const x = ((lng + 180) / 360) * WORLD_SIZE;
  const y =
    ((180 -
      (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI) / 360))) /
      360) *
    WORLD_SIZE;
  return [x, y];
};

export const worldToLngLat = (x: number, y: number): Position => {
  const lng = (x / WORLD_SIZE) * 360 - 180;
  const y2 = 180 - (y / WORLD_SIZE) * 360;
  const lat = (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
  return [lng, lat];
};

/**
 * clusterId 를 행정구역 단위/코드로 분해한다.
 * @example parseRegionClusterId('sgg_41110') // { level: 'sgg', code: '41110' }
 * @returns 행정구역 clusterId 가 아니면 null (예: v1 격자 클러스터, 클라이언트 클러스터)
 */
export const parseRegionClusterId = (
  clusterId: string | undefined,
): { level: RegionLevel; code: string } | null => {
  if (!clusterId) return null;
  for (const [prefix, level] of Object.entries(MAP_REGION_CONFIG.CLUSTER_PREFIX)) {
    if (clusterId.startsWith(prefix)) {
      const code = clusterId.slice(prefix.length);
      return code ? { level, code } : null;
    }
  }
  return null;
};

/** 구역 단위/코드에 해당하는 경계 파일 경로 */
export const getBoundaryPath = (level: RegionLevel, code: string): string => {
  if (level === 'emd') return MAP_REGION_CONFIG.BOUNDARY_PATH.emd(code.slice(0, 2));
  return MAP_REGION_CONFIG.BOUNDARY_PATH[level];
};

const getPolygons = (geometry: RegionGeometry): PolygonCoords[] =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

/** 월드 좌표 링의 면적 (shoelace) */
const ringArea = (ring: Position[]): number => {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(area / 2);
};

const round = (value: number) => Math.round(value * 100) / 100;

export const projectRegionFeature = (feature: RegionFeature): ProjectedRegion | null => {
  const polygons = getPolygons(feature.geometry).filter((polygon) => polygon[0]?.length);
  if (polygons.length === 0) return null;

  const projected = polygons.map((polygon) =>
    polygon.map((ring) => ring.map(([lng, lat]) => lngLatToWorld(lng, lat))),
  );

  let minX = Infinity;
  let minY = Infinity;
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  polygons.forEach((polygon) =>
    polygon[0].forEach(([lng, lat]) => {
      west = Math.min(west, lng);
      east = Math.max(east, lng);
      south = Math.min(south, lat);
      north = Math.max(north, lat);
    }),
  );
  projected.forEach((polygon) =>
    polygon[0].forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
    }),
  );

  const toLocal = ([x, y]: Position): Position => [
    round((x - minX) * LOCAL_SCALE),
    round((y - minY) * LOCAL_SCALE),
  ];

  const path = projected
    .map((polygon) =>
      polygon
        .map((ring) => {
          const local = ring.map(toLocal);
          return `M${local.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
        })
        .join(''),
    )
    .join('');

  // 사진은 본토(큰 폴리곤) 기준으로 채운다. 경북-울릉도처럼 멀리 떨어진 섬이 bbox 를 키우는 것을 방지
  const areas = projected.map((polygon) => ringArea(polygon[0]));
  const maxArea = Math.max(...areas);
  let rectMinX = Infinity;
  let rectMinY = Infinity;
  let rectMaxX = -Infinity;
  let rectMaxY = -Infinity;
  projected.forEach((polygon, index) => {
    if (areas[index] < maxArea * MINOR_POLYGON_AREA_RATIO) return;
    polygon[0].forEach((point) => {
      const [x, y] = toLocal(point);
      rectMinX = Math.min(rectMinX, x);
      rectMinY = Math.min(rectMinY, y);
      rectMaxX = Math.max(rectMaxX, x);
      rectMaxY = Math.max(rectMaxY, y);
    });
  });

  return {
    code: feature.properties.code,
    origin: [minX, minY],
    path,
    imageRect: {
      x: rectMinX,
      y: rectMinY,
      width: Math.max(rectMaxX - rectMinX, 1),
      height: Math.max(rectMaxY - rectMinY, 1),
    },
    polygons,
    bbox: [west, south, east, north],
  };
};

export const projectRegionCollection = (
  collection: RegionFeatureCollection,
): Map<string, ProjectedRegion> => {
  const result = new Map<string, ProjectedRegion>();
  collection.features.forEach((feature) => {
    const region = projectRegionFeature(feature);
    if (region) result.set(region.code, region);
  });
  return result;
};

const isPointInRing = (lng: number, lat: number, ring: Ring): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

/** 경위도 좌표가 행정구역 안에 있는지 (구멍 포함) */
export const isPointInRegion = (region: ProjectedRegion, lng: number, lat: number) => {
  const [west, south, east, north] = region.bbox;
  if (lng < west || lng > east || lat < south || lat > north) return false;
  return region.polygons.some(
    ([outer, ...holes]) =>
      isPointInRing(lng, lat, outer) &&
      !holes.some((hole) => isPointInRing(lng, lat, hole)),
  );
};

/**
 * 월드 좌표 → 화면 픽셀 아핀 변환을 구한다.
 * 기준점 3개를 project 해서 역산하므로 bearing, padding 이 있어도 정확하다. (pitch 0, 메르카토르 전제)
 */
export const computeWorldToScreen = (
  project: (lngLat: Position) => { x: number; y: number },
  anchor: Position,
): Affine => {
  const [ax, ay] = anchor;
  const p0 = project(worldToLngLat(ax, ay));
  const p1 = project(worldToLngLat(ax + 1, ay));
  const p2 = project(worldToLngLat(ax, ay + 1));
  const a = p1.x - p0.x;
  const b = p1.y - p0.y;
  const c = p2.x - p0.x;
  const d = p2.y - p0.y;
  return [a, b, c, d, p0.x - a * ax - c * ay, p0.y - b * ax - d * ay];
};

/** 구역 로컬 좌표 → 화면 픽셀 변환 (SVG transform 문자열) */
export const toRegionTransform = (worldToScreen: Affine, origin: Position): string => {
  const [a, b, c, d, e, f] = worldToScreen;
  const [ox, oy] = origin;
  return `matrix(${a / LOCAL_SCALE} ${b / LOCAL_SCALE} ${c / LOCAL_SCALE} ${d / LOCAL_SCALE} ${
    a * ox + c * oy + e
  } ${b * ox + d * oy + f})`;
};
