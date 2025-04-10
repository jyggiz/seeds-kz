import { getComponentForElement } from 'muban-core';

import C00Dummy from 'app/component/block/c00-dummy/C00Dummy.lazy';

export function getNavigationPlaceholderComponent(): C00Dummy | null {
  const navigationDummyElement = document.querySelector(
    `[data-component="${C00Dummy.displayName}"]`,
  ) as HTMLElement;

  return navigationDummyElement ? getComponentForElement<C00Dummy>(navigationDummyElement) : null;
}
