import { scrollIntoViewWithDelay } from './scrollIntoViewWithDelay';

interface DependentInputElements {
  componentElementForDependentInput: HTMLElement | null | undefined;
  dependentInput: HTMLInputElement | null | undefined;
  dependentInputWrapper: HTMLElement | null | undefined;
}

type DependencyMap = Map<Array<string>, DependentInputElements>;

export const makeInputDependencyMap = (dependencyWrapper: HTMLElement) => {
  const dependentInputsWrappers = Array.from(
    dependencyWrapper.querySelectorAll('[data-dependent-input-for]'),
  ) as HTMLElement[];

  const dependencyMap: DependencyMap = new Map();
  dependentInputsWrappers.forEach((dependentInputWrapper) => {
    const JsonValuesDependingOn = dependentInputWrapper.dataset.dependentInputFor;
    if (!JsonValuesDependingOn) {
      throw new Error('could not grab JSON with values input depends on');
    }
    const valuesDependingOn = JSON.parse(JsonValuesDependingOn) as Array<string>;

    const componentElementForDependentInput = dependentInputWrapper?.querySelector(
      '[data-component]',
    ) as HTMLElement | null | undefined;

    const dependentInput = componentElementForDependentInput?.querySelector('[data-input]') as
      | HTMLInputElement
      | null
      | undefined;

    const dependentElements = {
      dependentInputWrapper,
      componentElementForDependentInput,
      dependentInput,
    };

    dependencyMap.set(valuesDependingOn, dependentElements);
  });

  return dependencyMap;
};

export const selectEntries = (map: DependencyMap) => {
  return Array.from(map.entries());
};

export const selectDependentInputsElements = (map: DependencyMap) => {
  return Array.from(map.values());
};

export const setStateDependentInput = (
  { componentElementForDependentInput, dependentInput }: DependentInputElements,
  active: boolean,
) => {
  if (!componentElementForDependentInput) {
    throw new Error('could not find component element for dependent input to deactivate');
  }
  if (!dependentInput) {
    throw new Error('could not find dependent input to deactivate');
  }

  if (active) {
    const dependentInputScrollDelay = 100;

    componentElementForDependentInput.style.display = 'block';
    dependentInput.removeAttribute('data-block-validation');
    dependentInput.removeAttribute('disabled');

    scrollIntoViewWithDelay(dependentInput, dependentInputScrollDelay);
  } else {
    componentElementForDependentInput.style.display = 'none';
    dependentInput.setAttribute('data-block-validation', '');
    dependentInput.setAttribute('disabled', '');
  }
};

export const clearDependentInputs = (dependencyMap: DependencyMap) => {
  const dependentInputsElements = selectDependentInputsElements(dependencyMap);

  dependentInputsElements.forEach((dependentInputElements) =>
    setStateDependentInput(dependentInputElements, false),
  );
};
