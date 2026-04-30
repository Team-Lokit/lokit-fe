import type { EventName, EventParams } from './events';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const isBrowser = () => typeof window !== 'undefined';

export const gtmId = (): string | undefined => process.env.NEXT_PUBLIC_GTM_ID;

export function ensureDataLayer() {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
}

export function gtmTrack<E extends EventName>(event: E, params: EventParams<E>) {
  if (!isBrowser()) return;
  ensureDataLayer();
  window.dataLayer!.push({
    event,
    event_params: params,
  });
}

export function gtmSetUserProperties(props: Record<string, unknown>) {
  if (!isBrowser()) return;
  ensureDataLayer();
  window.dataLayer!.push({
    event: 'set_user_properties',
    user_properties: props,
  });
}
