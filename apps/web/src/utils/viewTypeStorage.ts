import { isViewType, type ViewType } from '@/components/viewSwitcher/ViewSwitcher';

const LAST_VIEW_TYPE_KEY = 'lokit:lastViewType';

/** 마지막으로 선택한 뷰 타입을 localStorage에서 읽음 (없거나 유효하지 않으면 null) */
export const readLastViewType = (): ViewType | null => {
  try {
    const stored = localStorage.getItem(LAST_VIEW_TYPE_KEY);
    return isViewType(stored) ? stored : null;
  } catch {
    return null;
  }
};

/** 마지막으로 선택한 뷰 타입을 localStorage에 저장 */
export const saveLastViewType = (view: ViewType): void => {
  try {
    localStorage.setItem(LAST_VIEW_TYPE_KEY, view);
  } catch {
    // ignore
  }
};
