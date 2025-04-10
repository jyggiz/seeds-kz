import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getComponentForElement } from 'muban-core';
import C07AccordionTransitionController from './C07AccordionTransitionController';
import O06CollapsibleItem from '../../organism/o06-collapsible-item/O06CollapsibleItem.lazy';
import CollapsibleEvent from '../../../util/collapsible/CollapsibleEvent';
import M03StickyMedia from '../../molecule/m03-sticky-media/M03StickyMedia.lazy';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { O06CollapsibleItemEvent } from '../../organism/o06-collapsible-item/o06-collapsible-item.utils';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

import './c07-accordion.scss';

export default class C07Accordion extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c07-accordion';

  public readonly transitionController: C07AccordionTransitionController;
  private stickyBackground: M03StickyMedia | null = null;

  private app!: App;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C07AccordionTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);

    this.getComponents<O06CollapsibleItem>(O06CollapsibleItem.displayName).forEach(
      (collapsible) => {
        this.addDisposableEventListener(
          collapsible.dispatcher,
          CollapsibleEvent.UPDATE_COMPLETE,
          this.onCollapseUpdateComplete.bind(this),
        );

        this.addDisposableEventListener<O06CollapsibleItemEvent>(
          collapsible.dispatcher,
          O06CollapsibleItemEvent.types.CLICK,
          (event) => {
            trackEvent({
              event: TrackingEventNames.ACCORDION_CLICK,
              aem_component_id: this.componentId,
              aem_component_name: this.element.dataset.componentName || '',
              question: event.data.label,
            });
          },
        );
      },
    );

    this.stickyBackground = this.getComponent<M03StickyMedia>(M03StickyMedia.displayName);

    getAppComponent().then((component) => {
      this.app = component;
    });
  }

  private onCollapseUpdateComplete(): void {
    // Expanding / collapsing makes the scroll tracker points change position
    this.app.updateScrollTrackerPoints();
  }
}
