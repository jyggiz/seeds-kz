import AbstractComponent from 'app/component/AbstractComponent';
import O45Form from '../../organism/o45-form/O45Form.lazy';
import { M59MapValue } from './M59DynamicDropdown.types';
import A15Select from '../../atom/a15-select/A15Select';
import { A15Item } from '../../atom/a15-select/A15Select.types';
import { getClosestComponentAsync } from '../../../util/getClosestComponentAsync';

export default class M59DynamicDropdown extends AbstractComponent {
  public static readonly displayName: string = 'm59-dynamic-dropdown';
  private _o45Form: O45Form | null = null;
  private _a15Select = this.getComponent<A15Select>(A15Select.displayName, this.element);
  private mapKeyValueArray: M59MapValue = JSON.parse(this.element.dataset.mapValue || '{}');
  private items: Array<A15Item> = JSON.parse(this.element.dataset.items || '[]');
  private previousDependantFieldValue = '';
  private readonly mapObject: Record<string, Array<string>> = {};

  constructor(el: HTMLElement) {
    super(el);
    if (this.mapKeyValueArray && Array.isArray(this.mapKeyValueArray.map)) {
      this.mapObject = this.mapKeyValueArray.map.reduce(
        (accum, item) => ({ ...accum, [item.key]: item.value }),
        {},
      );
    }
  }

  get o45Form(): O45Form {
    if (!this._o45Form) {
      throw new Error('Could not find o45 form');
    }

    return this._o45Form;
  }

  get a15Select(): A15Select {
    if (!this._a15Select) {
      throw new Error('Could not find a15-select');
    }
    return this._a15Select;
  }

  private setA15SelectOptions(values: Array<string>) {
    this.a15Select.setOptions(
      values
        .map((option) => {
          const item = this.items.find(({ value }) => value === option);
          return item ? new Option(item.label, item.value, false, item.selected) : null;
        })
        .filter((option): option is HTMLOptionElement => option !== null),
    );
  }

  async adopted() {
    this._o45Form = await getClosestComponentAsync(this.element, O45Form.displayName);
    this.a15Select.setOptions([]);
    this.o45Form.onChange((event) => {
      const { fieldName } = this.mapKeyValueArray;
      const elements = [...(event.currentTarget as HTMLFormElement).elements];
      const element = elements.find((element) => element.getAttribute('name') === fieldName) as
        | HTMLInputElement
        | undefined;

      if (!element || this.previousDependantFieldValue === element.value) {
        return;
      }
      this.previousDependantFieldValue = element.value;
      this.setA15SelectOptions(this.mapObject[element.value] || []);
    });
  }
}
