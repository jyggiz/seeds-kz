import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C78OverlayTransitionController from './S09OverlayTransitionController';
import { OVERLAY_ACTIONS } from './S09Overlay.types';
import { getAppComponent } from '../../../util/getElementComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class S09Overlay extends AbstractTransitionComponent {
  public static readonly displayName: string = 's09-overlay';

  public readonly transitionController: C78OverlayTransitionController;

  private actionInProgress = false;

  constructor(el: HTMLElement) {
    super(el);
    // styles for the overlay components in this container are lazy loaded,
    // so display: none is set on the html to hide it and its children
    this.element.style.display = 'block';
    this.transitionController = new C78OverlayTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
  }

  public dispatchAction = async (action: OVERLAY_ACTIONS, params?: Record<string, any>) => {
    if (this.actionInProgress) {
      return;
    }

    this.actionInProgress = true;

    if (process.env.NODE_ENV === 'development') {
      this.debug(action);
    }

    const overlayEvent = new CustomEvent('overlayAction', {
      detail: {
        ...action,
        params,
      },
    });

    const app = await getAppComponent();

    app?.element.dispatchEvent(overlayEvent);

    this.actionInProgress = false;
  };

  private debug(action: OVERLAY_ACTIONS) {
    console.log('ACTION: ', action.type);
    if ('payload' in action) {
      console.log('PAYLOAD: ', action.payload);
    }
  }
}
