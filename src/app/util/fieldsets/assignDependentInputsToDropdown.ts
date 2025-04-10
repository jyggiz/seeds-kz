import {
  clearDependentInputs,
  makeInputDependencyMap,
  selectEntries,
  setStateDependentInput,
} from './inputDependency';

export const assignDependentInputsToDropdown = (
  selectWrapper: HTMLElement,
  selectElement: HTMLSelectElement,
) => {
  const dependencyMap = makeInputDependencyMap(selectWrapper);
  const entries = selectEntries(dependencyMap);

  clearDependentInputs(dependencyMap);

  selectElement.addEventListener('change', (event) => {
    const target = event.target as HTMLOptionElement;

    entries.forEach(([valuesDependingOn, dependentInputsElements]) =>
      setStateDependentInput(dependentInputsElements, valuesDependingOn.includes(target.value)),
    );
  });

  return () => clearDependentInputs(dependencyMap);
};
