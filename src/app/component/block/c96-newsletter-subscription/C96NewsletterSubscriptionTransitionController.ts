import AbstractTransitionController from '../../AbstractTransitionController';
import C96NewsletterSubscription from './C96NewsletterSubscription.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import O45Form from '../../organism/o45-form/O45Form.lazy';

class C96NewsletterSubscriptionTransitionController extends AbstractTransitionController<C96NewsletterSubscription> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C96NewsletterSubscription,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const m04ComponentHeader = parent.getElement(
      `[data-component="${M04ComponentHeader.displayName}"]`,
    );
    const form = parent.getElement(`[data-component="${O45Form.displayName}"]`);

    if (m04ComponentHeader) timeline.add(this.getTimeline(m04ComponentHeader));

    if (form) timeline.add(slideFadeIn([form], 0.5, 0, 0));
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C96NewsletterSubscription,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C96NewsletterSubscription,
    id: string,
  ): void {}
}

export default C96NewsletterSubscriptionTransitionController;
