import AbstractComponent from '../../AbstractComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';

import './o87-testimonial.scss';
export default class O87Testimonial extends AbstractComponent {
  public static readonly displayName: string = 'o87-testimonial';

  public get isVisible(): boolean {
    return this.element.classList.contains(StateClassNames.ACTIVE);
  }

  public toggleVisibility(force?: boolean): void {
    const action = {
      true: 'add',
      false: 'remove',
      undefined: 'toggle',
    } as const;

    type ActionKey = keyof typeof action;

    this.element.classList[action[String(force) as ActionKey] as (typeof action)[ActionKey]](
      StateClassNames.ACTIVE,
    );
  }
}
