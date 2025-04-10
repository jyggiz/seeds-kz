import {
  getComponents,
  hasComponentInstance,
  setComponentInstance,
} from 'muban-core/lib/utils/componentStore';
interface ComponentModule {
  displayName: string;
  new (element: Element): ComponentInstance;
}
interface ComponentInstance {
  dispose?: () => void;
  adopted: () => void;
}
type ComponentEntry = {
  component: ComponentModule;
  element: Element;
  depth: number;
};
function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

let currentlyExecutingInit = false;

const isInitSlotEmpty = () =>
  new Promise((resolve, reject) => {
    if (!currentlyExecutingInit) {
      resolve(true);
    } else {
      reject(false);
    }
  });

export const requestEmptyInitSlot = async (callback: () => void | Promise<unknown>) => {
  const emptySlot = new Promise((resolve) => {
    const checkForEmptyInitSlot = () => {
      isInitSlotEmpty()
        .then(resolve)
        .catch(() => setTimeout(checkForEmptyInitSlot, 0));
    };

    checkForEmptyInitSlot();
  });

  await emptySlot;

  return await callback();
};

const initEntry = async ({ component, element }: ComponentEntry, deadline: number) => {
  const BlockConstructor = component;
  const { displayName } = BlockConstructor;
  try {
    const instance = new BlockConstructor(element);
    if (performance.now() >= deadline) {
      await yieldToMain();
    }
    setComponentInstance(displayName, { instance, element: element as HTMLElement });
    return instance;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
const getEntries = (rootElement: HTMLElement) => {
  const list: Array<ComponentEntry> = [];
  for (const component of getComponents()) {
    const BlockConstructor = component as unknown as ComponentModule;
    const { displayName } = BlockConstructor;
    if (!hasComponentInstance(rootElement)) {
      if (rootElement.getAttribute('data-component') === displayName) {
        list.push({
          component: BlockConstructor,
          element: rootElement,
          depth: getComponentDepth(rootElement as HTMLElement),
        });
      }
    }
    // find all DOM elements that belong in this block
    const componentElements = Array.from(
      rootElement.querySelectorAll(`[data-component="${displayName}"]`),
    );
    for (const element of componentElements) {
      if (!hasComponentInstance(element as HTMLElement)) {
        list.push({
          component: BlockConstructor,
          element,
          depth: getComponentDepth(element as HTMLElement),
        });
      }
    }
  }
  return list;
};
const initComponentEntries = async (
  componentEntries: Array<ComponentEntry>,
): Promise<Array<ComponentInstance>> => {
  const instances: Array<ComponentInstance> = [];
  const initAndGetInstance = async (entry: ComponentEntry, deadline: number) => {
    if (entry) {
      const instance = await initEntry(entry, deadline);
      instance && instances.push(instance);
    }
  };
  await yieldToMainWhileLooping({
    list: componentEntries,
    deadlineExtension: 10,
    runWhenThreadClear: initAndGetInstance,
  });
  return instances;
};

export default async function initComponentsInChunks(rootElement: HTMLElement): Promise<void> {
  currentlyExecutingInit = true;
  const entriesList = getEntries(rootElement);
  const sortedList = entriesList.concat().sort((a, b) => b.depth - a.depth);
  const instances = await initComponentEntries(sortedList);
  await callAdoptedOnInitComponents(instances.concat());
  currentlyExecutingInit = false;
}
const callAdoptedOnInitComponents = async (instances: Array<ComponentInstance>) => {
  const executeAdopted = (instance: ComponentInstance) => {
    if (instance && typeof instance.adopted === 'function') {
      instance.adopted();
    }
  };
  await yieldToMainWhileLooping({
    list: instances,
    deadlineExtension: 10,
    runWhenThreadClear: executeAdopted,
  });
};
const yieldToMainWhileLooping = async ({
  list,
  deadlineExtension,
  runWhenThreadClear,
}: {
  list: Array<any>;
  deadlineExtension: number;
  runWhenThreadClear: (item: any, deadline: number) => Promise<void> | void;
}) => {
  let deadline = performance.now() + deadlineExtension;
  while (list.length > 0) {
    if (performance.now() >= deadline) {
      await yieldToMain();
      deadline = performance.now() + deadlineExtension;
      continue;
    }
    const item = list.shift();
    await runWhenThreadClear(item, deadline);
  }
};
function getComponentDepth(element: HTMLElement): number {
  let depth = 0;
  let currentElement = element;
  while (currentElement.parentElement) {
    ++depth;
    currentElement = currentElement.parentElement;
  }
  return depth;
}
