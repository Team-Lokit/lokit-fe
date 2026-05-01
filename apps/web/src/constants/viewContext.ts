export const VIEW_CONTEXT_TYPE = {
  HOME: 'home',
  ALBUM_LIST: 'albumList',
  ALBUM_DETAIL: 'albumDetail',
  CLUSTER_DETAIL: 'clusterDetail',
} as const;

export type ViewContext =
  | { type: typeof VIEW_CONTEXT_TYPE.HOME }
  | { type: typeof VIEW_CONTEXT_TYPE.ALBUM_LIST }
  | { type: typeof VIEW_CONTEXT_TYPE.ALBUM_DETAIL; albumId: number }
  | {
      type: typeof VIEW_CONTEXT_TYPE.CLUSTER_DETAIL;
      clusterId: string;
      latitude: number;
      longitude: number;
    };
