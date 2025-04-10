import { getComponentForElement, initComponents, registerComponent } from 'muban-core';
import ICoreComponent from 'muban-core/lib/interface/ICoreComponent';
import { ComponentModule } from 'muban-core/lib/utils/componentStore';

const lazyLoadComponent = async (
  dynamicImport: () => Promise<{ default: ComponentModule }>,
): Promise<Array<ICoreComponent>> => {
  const module = (await dynamicImport()).default;
  registerComponent(module);
  const elements = [
    ...(document.querySelectorAll(
      `[data-component="${module.displayName}"]`,
    ) as NodeListOf<HTMLElement>),
  ];
  const initPromises = elements.map((element) => initComponents(element));
  await Promise.all(initPromises);
  const moduleInstances = elements.map((element) => getComponentForElement(element));

  if (!moduleInstances.length) {
    throw new Error(`Could not get module instances for component ${module.displayName}`);
  }
  return moduleInstances;
};

export { lazyLoadComponent };
