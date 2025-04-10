import {
  clearDependentInputs,
  makeInputDependencyMap,
  selectEntries,
  setStateDependentInput,
} from './inputDependency';

export const assignDependentInputsToRadioGroup = (
  radioGroup: HTMLFieldSetElement,
  radioButtons: ReadonlyArray<HTMLInputElement>,
) => {
  const dependencyMap = makeInputDependencyMap(radioGroup);
  const entries = selectEntries(dependencyMap);

  clearDependentInputs(dependencyMap);

  radioButtons.forEach((button) => {
    button.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;

      entries.forEach(([valuesDependingOn, dependentInputsElements]) =>
        setStateDependentInput(dependentInputsElements, valuesDependingOn.includes(target.value)),
      );
    });
  });

  return () => clearDependentInputs(dependencyMap);
};
