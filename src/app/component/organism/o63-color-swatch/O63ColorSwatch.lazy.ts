import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A04Eyebrow from 'app/component/atom/a04-eyebrow/A04Eyebrow';
import App from 'app/component/layout/app/App';
import M44CopyProgressIndicator from 'app/component/molecule/m44-copy-progress-indicator/M44CopyProgressIndicator.lazy';
import { getLuminance } from 'app/util/colorUtil';
import { getAppComponent } from 'app/util/getElementComponent';
import { getComponentForElement } from 'muban-core';
import O63ColorSwatchTransitionController from './O63ColorSwatchTransitionController';

import './o63-color-swatch.scss';
export default class O63ColorSwatch extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o63-color-swatch';

  public readonly transitionController: O63ColorSwatchTransitionController;
  private dataColorCards = this.getElements(`[data-color-card]`);
  private hexCode = this.getElement(`[data-hex] [data-component="${A04Eyebrow.displayName}"]`);
  private colorCard = this.getElement('[data-color-card]');
  private copyProgressIndicator: any = this.getElement(
    `[data-component="${M44CopyProgressIndicator.displayName}"]`,
  );

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O63ColorSwatchTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.handleColorCardContrast();
  }

  private addEventListeners(): void {
    this.copyToClipboard();
  }

  private copyToClipboard() {
    if (!this.copyProgressIndicator) return;
    const copyProgressIndicator = getComponentForElement<M44CopyProgressIndicator>(
      this.copyProgressIndicator,
    );
    const textArea = document.createElement('textarea');
    copyProgressIndicator.element.addEventListener('click', () => {
      if (this.hexCode) {
        copyProgressIndicator.handleResetProgress();
        textArea.value = this.hexCode.innerText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyProgressIndicator.handleProgress();
      }
    });

    if (this.colorCard) {
      this.colorCard.addEventListener('mouseleave', () => {
        copyProgressIndicator.handleResetProgress();
      });
    }
  }

  private handleColorCardContrast() {
    this.dataColorCards.forEach((card) => {
      const color = card.getAttribute('data-color')?.toString();
      if (color) {
        card.classList.add(getLuminance(color) > 0.64 ? '-isLight' : '-isDark');
      }
    });
  }
}
