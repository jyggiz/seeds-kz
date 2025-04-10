import { initComponents } from 'muban-core';
import { lazyLoadComponents } from './lazyLoadComponents';
import { isEditor } from './util/aemEditorUtils';
import { addComponentInstancesToScrollManager } from './addComponentInstancesToScrollManager';

export function initiateAemHotreload(appContainer: HTMLElement): void {
  if (!isEditor()) {
    return;
  }

  const bodyMutationObserver = new MutationObserver(async (mutations) => {
    const shouldInitialize = mutations.some((record) => {
      return Array.from(record.addedNodes).some((node) => {
        const element = node as HTMLElement;
        // Check if author added a new component element in aem that
        // would need to have a new associated component instance

        // note: When author adds a component, AEM adds the component element node twice.
        // The second node replaces the first iteration of the node. So we want to run
        // the muban init process only after the second node (second one contains 'aem-GridColum)
        // replaces the first one.
        if (element.classList && element.classList.contains('aem-GridColumn')) {
          return Array.from(element.children).some((child) => {
            const element = child as HTMLElement;

            return element.dataset.component !== undefined;
          });
        }
      });
    });

    // if any components are added, we need to lazy load their modules (if the components are lazy)
    // and run the initComponents function again
    if (shouldInitialize) {
      const lazyLoadedComponents = await lazyLoadComponents(appContainer);
      // lazy loading process runs initComponents internally
      if (!lazyLoadedComponents) {
        await initComponents(appContainer);
        addComponentInstancesToScrollManager();
      }
    }
  });

  const addBodyMutationObserverIfAppAvailable = () => {
    let timeoutId;
    const app = document.querySelector('#app');
    if (app) {
      bodyMutationObserver.observe(app, {
        subtree: true,
        childList: true,
        characterData: true,
      });

      timeoutId && clearTimeout(timeoutId);
    } else {
      timeoutId = setTimeout(addBodyMutationObserverIfAppAvailable, 500);
    }
  };

  addBodyMutationObserverIfAppAvailable();
}
