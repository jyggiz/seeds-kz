import { initComponents, registerComponent, requestEmptyInitSlot } from 'muban-core';
import { ComponentModule } from 'muban-core/lib/utils/componentStore';
import { addComponentInstancesToScrollManager } from './addComponentInstancesToScrollManager';

const LOADING_COMPONENTS: Record<string, true> = {};
const LOADED_COMPONENTS: Record<string, true> = {};

function loadComponents(context: __WebpackModuleApi.RequireContext) {
  const loadComponents: Array<Promise<ComponentModule>> = context
    .keys()
    .map((filePath) => ({
      id: extractComponentId(filePath),
      filePath,
    }))
    .filter(({ id }) => {
      return (
        // don't load the component if we fail to extract id
        id &&
        // don't load the component if it is being initialized
        !(id in LOADING_COMPONENTS) &&
        // don't load the component if has been initialized
        !(id in LOADED_COMPONENTS) &&
        // load the component only if there's an associated dom element
        // eslint-disable-next-line no-restricted-properties
        document.querySelector(`[data-component="${id}"]`)
      );
    })
    .map(async ({ id, filePath }) => {
      // we can be sure id is not a falsy value as we filter above based on id
      LOADING_COMPONENTS[id!] = true;

      try {
        const module = await context(filePath);

        LOADED_COMPONENTS[id!] = true;

        // component is the default export of the module
        return module.default;
      } catch (err) {
        console.error(err);
      } finally {
        delete LOADING_COMPONENTS[id!];
      }
    });

  return loadComponents;
}

export async function lazyLoadComponents(
  rootElement: HTMLElement,
  context: __WebpackModuleApi.RequireContext = require.context(
    '../app/component/',
    true,
    /\.lazy\.ts$/,
    'lazy',
  ),
): Promise<void | true> {
  const lazyComponentModulePromises = loadComponents(context);

  if (lazyComponentModulePromises.length === 0) return;

  const loadedModules = await Promise.all(lazyComponentModulePromises);

  // filter out any undefined items in components array as a result
  // of a potentially rejected promise while webpack loads a module
  const components = loadedModules.filter(Boolean);

  if (components.length > 0) {
    await requestEmptyInitSlot(() => initLazyComponents(components, rootElement));

    // if some modules have been loaded, registered and initiated
    // promise will resolve with true / otherwise with undefined
    return true;
  }
}

const initLazyComponents = async (components: ComponentModule[], root: HTMLElement) => {
  for (const component of components) {
    registerComponent(component);
  }

  await initComponents(root);
  addComponentInstancesToScrollManager();
};

const extractComponentId = (filePath: string) => {
  const regExp = new RegExp('^(?:./[^/]*){1}/([^/]+)');
  const match = regExp.exec(filePath);
  const componentName = match ? match[1] : null;
  return componentName;
};
