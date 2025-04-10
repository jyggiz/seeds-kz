import AbstractComponent from 'app/component/AbstractComponent';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { VIDEO } from 'app/util/overlayActionTypes';
import { O01VideoProps } from '../o01-video/O01Video.types';
import { Errors } from 'app/data/enum/Errors';

import './o12-rich-quote.scss';

const lazyO02Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class O12RichQuote extends AbstractComponent {
  public static readonly displayName: string = 'o12-rich-quote';

  private readonly playButton = this.getElement('[data-play-button]');
  private readonly videoOverlay = this.getElement('[data-video-mobile]');

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private async onVideoOverlayPlay(): Promise<void> {
    const video = this.videoOverlay?.dataset.video;

    if (video === undefined) {
      throw new Error('Video data was not found');
    }

    if (this.app === null) {
      throw new Error(Errors.APP_NOT_FOUND);
    }

    try {
      const data = JSON.parse(video);

      const [template, overlay] = await Promise.all([lazyO02Template(), this.app.overlay]);

      await overlay.dispatchAction({
        type: VIDEO.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
    } catch {
      throw new Error("VIDEO.STANDARD_DYNAMIC payload couldn't be parsed");
    }
  }

  private addEventListeners(): void {
    if (!this.playButton) {
      return;
    }

    this.addDisposableEventListener(this.playButton, 'click', () => {
      this.onVideoOverlayPlay();
    });
  }
}
