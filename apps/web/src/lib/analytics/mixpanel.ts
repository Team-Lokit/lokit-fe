import mixpanel from 'mixpanel-browser';
import type { EventName, EventParams } from './events';

const isBrowser = () => typeof window !== 'undefined';

let initialized = false;

export const mixpanelToken = (): string | undefined =>
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export function mixpanelInit() {
  if (!isBrowser() || initialized) return;
  const token = mixpanelToken();
  if (!token) return;

  mixpanel.init(token, {
    autocapture: true,
    record_sessions_percent: 100,
  });
  initialized = true;
}

export function mixpanelTrack<E extends EventName>(event: E, params: EventParams<E>) {
  if (!initialized) return;
  mixpanel.track(event, params);
}

export function mixpanelIdentify(userId: string) {
  if (!initialized) return;
  mixpanel.identify(userId);
}

export function mixpanelRegister(props: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.register(props);
}

export function mixpanelSetPeople(props: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.people.set(props);
}

export function mixpanelReset() {
  if (!initialized) return;
  mixpanel.reset();
}
