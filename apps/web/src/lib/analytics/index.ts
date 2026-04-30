import type { EventName, EventParams, UserProperties } from './events';
import { gtmTrack } from './gtm';
import { mixpanelTrack, mixpanelIdentify, mixpanelReset, mixpanelInit } from './mixpanel';
import { setSuperProperties, clearSuperProperties } from './superProperties';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * 단일 진입점. GTM(dataLayer) + Mixpanel 양쪽으로 fan-out.
 *
 * @example
 * track('login_success', { is_new_user: true, login_method: 'kakao' });
 */
export function track<E extends EventName>(event: E, params: EventParams<E>) {
  if (isDev && typeof window !== 'undefined') {
    console.debug('[analytics]', event, params);
  }
  gtmTrack(event, params);
  mixpanelTrack(event, params);
}

/**
 * 로그인 성공 시 호출.
 * - Mixpanel distinct_id를 user_id로 변경
 * - 이후 모든 이벤트에 user_id 자동 첨부
 */
export function identify(userId: string, props?: UserProperties) {
  mixpanelIdentify(userId);
  setSuperProperties({ user_id: userId, ...props });
}

/**
 * 회원 탈퇴/로그아웃 시 호출.
 */
export function resetIdentity() {
  clearSuperProperties();
  mixpanelReset();
}

export { setSuperProperties, mixpanelInit as initMixpanel };
export type { EventName, EventParams, UserProperties };
