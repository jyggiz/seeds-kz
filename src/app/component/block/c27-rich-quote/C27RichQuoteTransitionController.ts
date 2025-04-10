import AbstractTransitionController from '../../AbstractTransitionController';
import C27RichQuote from './C27RichQuote.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import M09RichQuoteThumbnail from 'app/component/molecule/m09-rich-quote-thumbnail/M09RichQuoteThumbnail';
import { isEditor } from 'app/util/aemEditorUtils';

class C27RichQuoteTransitionController extends AbstractTransitionController<C27RichQuote> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C27RichQuote,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const isAemEditor = isEditor();
    if (isAemEditor) return;

    const authorAsset = parent.getElement('[data-author-asset]') as HTMLElement;
    const quoteElement = parent.getElement('[data-quote]');

    const thumbnails = parent.getElements(
      `[data-component="${M09RichQuoteThumbnail.displayName}"]`,
    );
    const previousThumbnail = thumbnails.filter(
      (thumbnail) =>
        thumbnail.classList.contains('-previous') && thumbnail.style.visibility !== 'hidden',
    );
    const nextThumbnail = thumbnails.filter(
      (thumbnail) =>
        thumbnail.classList.contains('-next') && thumbnail.style.visibility !== 'hidden',
    );

    if (quoteElement) {
      timeline.fromTo(
        quoteElement,
        0.5,
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: eases.VinnieInOut,
        },
        0.4,
      );
    }

    if (authorAsset) {
      timeline.fromTo(
        authorAsset,
        1,
        {
          y: 200,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0,
      );
    }

    if (previousThumbnail) {
      timeline.fromTo(
        previousThumbnail,
        1,
        {
          x: -150,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0,
      );
    }

    if (nextThumbnail) {
      timeline.fromTo(
        nextThumbnail,
        1,
        {
          x: 150,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C27RichQuote,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C27RichQuote,
    id: string,
  ): void {}
}

export default C27RichQuoteTransitionController;
