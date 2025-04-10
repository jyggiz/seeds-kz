import { addEventListener } from 'seng-disposable-event-listener';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C119DraggableGalleryTransitionController from './C119DraggableGalleryTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C119GridView from './grid-view/C119GridView';
import C119SliderView from './slider-view/C119SliderView';
import M02Button from '../../molecule/m02-button/M02Button';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { MODAL } from '../../../util/overlayActionTypes';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import C119DraggableGalleryEvent from './C119DraggableGalleryEvent';

import './c119-draggable-gallery.scss';
import { isEditor } from '../../../util/aemEditorUtils';

type View = 'grid' | 'slider';

const lazyO119ModalTemplate = () =>
  import('./modal/o119-modal.hbs?include') as LoadTemplateImport<any>;

export default class C119DraggableGallery extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c119-draggable-gallery';

  public readonly transitionController: C119DraggableGalleryTransitionController;

  private readonly gridView = this.getComponent<C119GridView>(C119GridView.displayName);
  private readonly sliderView = this.getComponent<C119SliderView>(C119SliderView.displayName);

  private readonly viewControls = this.getElement('[data-view-controls]');
  private readonly toggleButtons = this.viewControls
    ? this.getComponents<M02Button>(M02Button.displayName, this.viewControls)
    : [];

  private _activeView: View = 'grid';
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C119DraggableGalleryTransitionController(this);
  }

  public async adopted() {
    if (!this.gridView || !this.sliderView) {
      throw new Error('C119DraggableGallery: Missing required components');
    }

    this.app = await getAppComponent();

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.activeView = isEditor() ? 'slider' : 'grid';
    this.addEventListeners();

    setAsInitialised(this.element);
  }

  private get activeView(): View {
    return this._activeView;
  }

  private set activeView(value: View) {
    this._activeView = value;

    this.toggleButtons.forEach((button) => {
      if (button.element.dataset.view === value) {
        button.level = 'primary';
      } else {
        button.level = 'secondary';
      }
    });

    if (!this.gridView || !this.sliderView) return;

    if (value === 'grid') {
      this.gridView.transitionIn();
      this.sliderView.transitionOut();
    } else {
      this.sliderView.transitionIn();
      this.gridView.transitionOut();
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.toggleButtons.forEach((button) =>
      this.disposables.add(
        addEventListener(button.element, 'click', this.onToggleClick.bind(this, button)),
      ),
    );

    [this.sliderView, this.gridView].forEach((component) => {
      if (component) {
        this.addDisposableEventListener<C119DraggableGalleryEvent>(
          component.dispatcher,
          C119DraggableGalleryEvent.OPEN_SLIDE_MODAL,
          ({ element }) => this.openModal(element),
        );
      }
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    if (state <= 2) {
      this.activeView = 'slider';
    }
  }

  private onToggleClick(button: M02Button): void {
    const viewType = button.element.dataset.view as View | undefined;

    if (viewType) {
      this.activeView = viewType;
    }
  }

  private async openModal(button: HTMLElement) {
    const data = button.dataset.modal && JSON.parse(button.dataset.modal);
    if (!data) return;

    const [o119ModalTemplate, overlay] = await Promise.all([
      lazyO119ModalTemplate(),
      this.app?.overlay,
    ]);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o119ModalTemplate.default,
        data,
        options: {
          classnames: ['-fullWidth', '-controlsAlignRight'],
        },
      },
    });
  }
}
