import type { BridgeRequest, BridgeResponse } from '@repo/webview-bridge';

const generateRequestId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/**
 * BridgeRequest의 각 변종에서 requestId만 떼어낸 union.
 * - 분배 조건부 타입(`T extends unknown ? ... : never`)을 써야 union이 보존됨
 *   (그냥 Omit<BridgeRequest, 'requestId'>는 union을 평탄화시킴)
 */
type CallableRequest = BridgeRequest extends infer T
  ? T extends BridgeRequest
    ? Omit<T, 'requestId'>
    : never
  : never;

/**
 * 네이티브 브리지 호출 공통 도우미.
 * - WebView 환경에서만 호출해야 함 (bridge 미가용 시 reject)
 * - requestId 생성 + register + postMessage를 한번에 처리
 * - 응답 status에 따라 자동 분기:
 *   - 'success' → resolve(response)
 *   - 'cancelled' → resolve(null)
 *   - 'error' → reject(Error)
 */
export const callBridge = <Res extends BridgeResponse>(
  request: CallableRequest,
): Promise<Res | null> => {
  const bridge = window.__lokitBridge;
  const rnWebView = window.ReactNativeWebView;
  if (!bridge || !rnWebView) {
    return Promise.reject(new Error('Bridge not available'));
  }

  const requestId = generateRequestId();

  return new Promise((resolve, reject) => {
    bridge.register(requestId, (response) => {
      if (response.status === 'cancelled') {
        resolve(null);
        return;
      }
      if (response.status === 'error') {
        reject(new Error(response.error ?? 'Bridge error'));
        return;
      }
      resolve(response as Res);
    });

    rnWebView.postMessage(JSON.stringify({ ...request, requestId }));
  });
};
