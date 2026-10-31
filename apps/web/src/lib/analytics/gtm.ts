import type { EventName, EventParams } from './events';
import { isAnalyticsEnabled } from './enabled';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const gtmId = (): string | undefined => process.env.NEXT_PUBLIC_GTM_ID;

export function ensureDataLayer() {
  if (!isAnalyticsEnabled()) return;
  window.dataLayer = window.dataLayer || [];
}

export function gtmTrack<E extends EventName>(event: E, params: EventParams<E> | null) {
  if (!isAnalyticsEnabled()) return;
  ensureDataLayer();
  window.dataLayer!.push({
    event,
    event_params: params,
  });
}

export function gtmSetUserProperties(props: Record<string, unknown>) {
  if (!isAnalyticsEnabled()) return;
  ensureDataLayer();
  window.dataLayer!.push({
    event: 'set_user_properties',
    user_properties: props,
  });
}
