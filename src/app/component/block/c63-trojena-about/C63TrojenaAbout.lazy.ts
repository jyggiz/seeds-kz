import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C63TrojenaAboutTransitionController from './C63TrojenaAboutTransitionController';
import ScrollHijackController from '../../../util/ScrollHijackController';
import lerp from 'lerp';
import { TweenMax } from 'gsap';
import { isEditor } from '../../../util/aemEditorUtils';
import { clamp } from '../../../util/clamp';
import A01Image from '../../atom/a01-image/A01Image';
import M18Paragraph from '../../molecule/m18-paragraph/M18Paragraph';

import './c63-trojena-about.scss';

export default class C63TrojenaAbout extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c63-trojena-about';

  private paragraphs = this.getElements(`[data-component="${M18Paragraph.displayName}"]`);
  private topImage = this.getElement(`[data-intro] [data-component="${A01Image.displayName}"]`);

  private hasZoomingAnimation = Boolean(this.element.dataset.zoomingAnimation || '');
  private hasTextAppearingAnimation = Boolean(this.element.dataset.textAnimation || '');

  public readonly transitionController: C63TrojenaAboutTransitionController;

  private scrollHijackController: ScrollHijackController | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C63TrojenaAboutTransitionController(this);
  }

  public async adopted() {
    await this.initScrollHijack();

    setAsInitialised(this.element);
  }

  private async initScrollHijack(): Promise<void> {
    if (isEditor() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [firstParagraph, secondParagraph] = this.paragraphs;

    let imageCurrentScale = 1;

    this.scrollHijackController = await new ScrollHijackController({
      parentElement: this.element,
      onScroll: ({ scrollPosition }) => {
        const position = scrollPosition + window.innerHeight;

        if (this.hasZoomingAnimation && this.topImage) {
          const maxScrollPosition = this.element.clientHeight + window.innerHeight;

          const imageNewScale = clamp((position * 0.45) / maxScrollPosition + 1, 1, 1.45);

          imageCurrentScale = lerp(imageCurrentScale, imageNewScale, 0.2);

          TweenMax.set(this.topImage, {
            scale: imageCurrentScale,
          });
        }

        if (this.hasTextAppearingAnimation) {
          const firstParagraphOpacity = clamp((position - 350) / 350, 0, 1);
          const secondParagraphOpacity = clamp((position - 420) / 420, 0, 1);

          TweenMax.set(firstParagraph, {
            opacity: firstParagraphOpacity,
          });

          TweenMax.set(secondParagraph, {
            opacity: secondParagraphOpacity,
          });
        }
      },
    }).initScrollHijack();
  }

  public dispose() {
    super.dispose();

    this.scrollHijackController?.dispose();
  }
}
