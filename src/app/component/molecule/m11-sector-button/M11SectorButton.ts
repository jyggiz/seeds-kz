import AbstractComponent from '../../AbstractComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class M11SectorButton extends AbstractComponent {
  public static readonly displayName: string = 'm11-sector-button';

  public disable(): void {
    this.element.classList.add(StateClassNames.DISABLED);
  }

  public enable(): void {
    this.element.classList.remove(StateClassNames.DISABLED);
  }
}
