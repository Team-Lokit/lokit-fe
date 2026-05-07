import { gtmSetUserProperties } from './gtm';
import { mixpanelRegister, mixpanelSetPeople } from './mixpanel';
import type { UserProperties } from './events';

let superProps: UserProperties = {};

export function getSuperProperties(): UserProperties {
  return { ...superProps };
}

/**
 * 모든 후속 이벤트에 자동 첨부할 공통 속성 등록.
 * - GTM: user_properties
 * - Mixpanel: register (super properties) + people.set
 */
export function setSuperProperties(props: UserProperties) {
  superProps = { ...superProps, ...props };
  gtmSetUserProperties(superProps);
  mixpanelRegister(superProps);
  mixpanelSetPeople(superProps);
}

export function clearSuperProperties() {
  superProps = {};
}
