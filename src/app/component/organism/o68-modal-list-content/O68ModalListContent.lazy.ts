import AbstractComponent from 'app/component/AbstractComponent';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import { O68ModalListContentProps } from './O68ModalListContent.types';
import {
  O09ModalCarouselContentItem,
  O09ModalCarouselContentProps,
} from 'app/component/organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import App from 'app/component/layout/app/App';
import { MODAL } from 'app/util/overlayActionTypes';
import O64HotspotMap from '../o64-hotspot-map/O64HotspotMap.lazy';
import { getAppComponent } from 'app/util/getElementComponent';
import {
  ModalListVariant,
  ItineraryItem,
  GroupedHotspotsItem,
} from '../o67-modal-list-viewer/O67ModalListViewer.types';

import './o68-modal-list-content.scss';

const lazyO09 = () =>
  import(
    '../o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

const LazyContent = {
  [ModalListVariant.Itineraries]: lazyO09,
  [ModalListVariant.GroupedHotspots]: lazyO09,
};

export default class O68ModalListContent extends AbstractComponent {
  public static readonly displayName: string = 'o68-modal-list-content';
  private contentContainer = this.getElement('[data-content]');
  private listItemButtons: ReadonlyArray<HTMLButtonElement> | null =
    this.contentContainer &&
    this.getElements(`[data-component="${M02Button.displayName}"]`, this.contentContainer);

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted(): Promise<void> {
    this.app = await getAppComponent();

    const listData: O68ModalListContentProps | undefined =
      this.element.dataset.modalProps && JSON.parse(this.element.dataset.modalProps);

    if (!listData) {
      throw new Error('listData is undefined');
    }

    const listType = listData.type;

    if (!listType) {
      return;
    }

    if (listData.type === ModalListVariant.Itineraries) {
      const O09Data: Array<O09ModalCarouselContentItem> = listData.items.map(
        (iterinary: ItineraryItem & GroupedHotspotsItem) => {
          let copyIteninary = { ...iterinary };

          copyIteninary.icon && delete copyIteninary.icon;

          const items = copyIteninary.items.map((item) => {
            item.heading.button && delete item.heading.button;
            return item;
          });

          copyIteninary = { ...copyIteninary, items };

          const formattedItinerary = {
            content: {
              ...copyIteninary,
              heading: {
                text: (iterinary.heading.button && iterinary.heading.button.label) ?? '',
              },
            },
          };

          return formattedItinerary;
        },
      );

      this.listItemButtons &&
        this.listItemButtons.forEach((button, index) =>
          this.addDisposableEventListener(button, 'click', async () => {
            const data = {
              items: O09Data,
              activeItemIndex: index,
              variant: 'fullBleedCarousel',
              highlightItinerary: true,
            };

            const template = LazyContent[listType];

            const [templateLoaded, overlay] = await Promise.all([template(), this.app?.overlay]);

            await overlay?.dispatchAction({
              type: MODAL.STANDARD_DYNAMIC,
              payload: {
                template: templateLoaded.default,
                data,
                options: {
                  classnames: ['-fullBleedCarousel'],
                },
              },
            });
          }),
        );
    } else if (listData.type === ModalListVariant.GroupedHotspots) {
      const o64Instance = this.app.getComponentInAppContext(O64HotspotMap);

      this.listItemButtons &&
        o64Instance &&
        this.listItemButtons.forEach((button, index) =>
          this.addDisposableEventListener(button, 'click', () => o64Instance.onHotSpotClick(index)),
        );
    }
  }
}
