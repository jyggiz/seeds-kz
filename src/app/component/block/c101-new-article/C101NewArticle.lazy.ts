import { DeviceStateEvent } from 'seng-device-state-tracker';
import findLast from 'lodash-es/findLast';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { TweenMax } from 'gsap';

import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { ContentTableController, ContentTableType } from './utils/ContentTableController';
import C101NewArticleTransitionController from './C101NewArticleTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { Errors } from './c101NewArticle.const';
import { getAppComponent } from 'app/util/getElementComponent';
import { getElementAbsoluteYCoordinate, updateHash } from './utils/general';
import mq from '../../../data/shared-variable/media-queries.json';
import { openSharePopup } from '../../../util/OpenSharePopup';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { ScrollController } from './utils/ScrollController';
import TableOfContents, {
  TableOfContentEvent,
} from './component/organism/table-of-contents/TableOfContents.lazy';

import './c101-new-article.scss';
import './component/molecule/author-info/author-info.scss';
import './component/organism/article-cta/article-cta.scss';
import App from '../../layout/app/App';

export default class C101NewArticle extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c101-new-article';

  private readonly articleBody = this.getElement('[data-article-body]');
  private readonly articleContent = this.getElement('[data-article-content]');
  private readonly articleInfo = this.getElement('[data-info]');
  private readonly paragraphs: ReadonlyArray<HTMLElement> = this.getElements(
    '[data-paragraph-anchor]',
    this.articleBody || undefined,
  );
  private readonly regularContentTable = this.getComponent<TableOfContents>(
    TableOfContents.displayName,
    this.articleContent || undefined,
  );
  private readonly stickyContentTable = this.getComponent<TableOfContents>(
    TableOfContents.displayName,
    this.articleInfo || undefined,
  );
  private readonly shareButtons = this.getElements('[data-share-button]');
  private readonly toTopButton = this.getElement('[data-to-top-button]');

  private readonly contentTableController: ContentTableController | null = null;
  private isMobile: boolean = false;
  private navigationHeight: number = 0;
  private readonly scrollController: ScrollController;
  private app: App | null = null;

  public readonly transitionController: C101NewArticleTransitionController;
  private scrollRaf = 0;

  /**
   * Runs 60 times per second, includes main logic for both mobile and desktop
   * @private
   */
  private async tick(): Promise<void> {
    this.navigationHeight = (await this.app?.getNavigationHeight()) || 0;

    if (this.isMobile) {
      this.contentTableController?.setActiveContentTable('regular');
      this.toggleToTopButton();
    } else {
      this.contentTableController?.setActiveContentTable('sticky');
      this.updateArticleInfoPositionState();
    }

    this.scrollRaf = requestAnimationFrame(this.tick.bind(this));
  }

  getContentTableTypeByDeviceState(deviceStateData: IDeviceStateData): ContentTableType {
    return this.isDeviceStateMobile(deviceStateData) ? 'regular' : 'sticky';
  }

  constructor(el: HTMLElement) {
    super(el);

    if (this.regularContentTable && this.stickyContentTable) {
      this.contentTableController = new ContentTableController({
        stickyContentTable: this.stickyContentTable,
        regularContentTable: this.regularContentTable,
        type: this.getContentTableTypeByDeviceState(deviceStateTracker.currentDeviceState),
      });
    }

    this.transitionController = new C101NewArticleTransitionController(this);
    this.scrollController = new ScrollController();

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);

    if (this.paragraphs[0] && this.contentTableController) {
      this.contentTableController.activeContentTable.changeActiveItem(this.paragraphs[0].id);
    }
    this.app = await getAppComponent();
    this.tick();
    this.scrollToDeepLink();
  }

  /**
   * Returns absolute Y coordinate which is equal to the highest point of given element
   *
   * @param {HTMLElement} element - HTML element relative to which the calculation will take place
   * @param {boolean} forceExtraOffset - boolean flag including/excluding extra y offset from calculation
   * @returns the absolute vertical coordinate(Y) which is equal to the highest point of our @element with/without @extraOffset
   */
  private getElementAbsoluteYCoordinate(element: HTMLElement, forceExtraOffset?: boolean): number {
    return getElementAbsoluteYCoordinate({
      element,
      extraOffset: this.navigationHeight + (forceExtraOffset ? 10 : 0),
    });
  }

  private getParagraphById(id: string): HTMLElement | undefined {
    return this.paragraphs.find((element) => element.id === id);
  }

  /**
   * Scrolls the page to the paragraph with the id found in the hash
   */
  private scrollToDeepLink(): void {
    const id = window.location.hash.replace('#', '');
    const paragraph = this.getParagraphById(id);

    if (!paragraph) {
      return;
    }

    this.scrollController.scrollToElement(paragraph, -this.navigationHeight);
    this.contentTableController?.activeContentTable.changeActiveItem(id);
  }

  /**
   * Updates the hash and the active element in the article navigation(content table)
   * based on the last visible paragraph in the viewport
   */
  private activateVisibleParagraph(): void {
    const lastVisibleParagraph = findLast(
      this.paragraphs,
      (element) => this.getElementAbsoluteYCoordinate(element, true) < scrollY,
    );

    if (lastVisibleParagraph) {
      this.contentTableController?.activeContentTable.changeActiveItem(lastVisibleParagraph.id);
      updateHash(`#${lastVisibleParagraph.id}`);
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.shareButtons.forEach((button) => {
      this.addDisposableEventListener(button, 'click', () => openSharePopup(button));
    });

    this.addDisposableEventListener(document, 'mousewheel', () => {
      this.activateVisibleParagraph();
    });

    this.addDisposableEventListener(document, 'touchmove', () => {
      this.activateVisibleParagraph();
    });

    if (this.contentTableController) {
      this.addDisposableEventListener<TableOfContentEvent>(
        this.contentTableController.activeContentTable.dispatcher,
        TableOfContentEvent.UPDATE,
        ({ paragraphId }) => {
          const paragraph = this.getParagraphById(paragraphId);

          if (!paragraph) {
            throw new Error(Errors.PARAGRAPH_NOT_FOUND);
          }

          this.scrollController.scrollToElement(paragraph, -this.navigationHeight);
        },
      );
    }

    if (!this.toTopButton) {
      throw new Error(Errors.TO_TOP_BUTTON_NOT_FOUND);
    }
    this.addDisposableEventListener(this.toTopButton, 'click', this.onToTopButtonClick.bind(this));
  }

  /**
   * Update article info static/sticky position based on the Y coordinate of the element
   * relative to the navigation height
   *
   * NOTE: This functionality works only on the Desktop((=> XLARGE))
   */
  private updateArticleInfoPositionState(): void {
    if (!this.articleInfo) {
      throw new Error(Errors.ARTICLE_INFO_NOT_FOUND);
    }

    if (!this.articleContent) {
      throw new Error(Errors.ARTICLE_CONTENT_NOT_FOUND);
    }

    const { top: offsetTop, bottom: offsetBottom } = this.articleContent.getBoundingClientRect();
    const shouldBeSticky = offsetTop <= this.navigationHeight + 20;
    const reachedTheBottom =
      offsetBottom <= this.articleInfo.clientHeight + this.navigationHeight + 40;
    const options: gsap.TweenConfig =
      shouldBeSticky && !reachedTheBottom
        ? {
            position: 'fixed',
            width: this.articleInfo.clientWidth,
            top: this.navigationHeight + 20,
          }
        : { position: 'static', alignSelf: reachedTheBottom ? 'end' : 'start' };

    TweenMax.set(this.articleInfo, options);
  }

  /**
   * Displays 'Move to top' button if the 10px has been scrolled down from the beginning of the first paragraph
   * 10px = extraOffset from getElementAbsoluteYCoordinate
   *
   * NOTE: This functionality works only on the Mobile(< XLARGE)
   */
  private toggleToTopButton(): void {
    if (!this.toTopButton) {
      throw new Error(Errors.TO_TOP_BUTTON_NOT_FOUND);
    }

    const [firstParagraph] = this.paragraphs;
    const y = this.getElementAbsoluteYCoordinate(firstParagraph, true);

    TweenMax.to(this.toTopButton, 0.2, {
      opacity: y <= scrollY ? 1 : 0,
    });
  }

  /**
   * Scrolls to the first paragraph and updates the article navigation(content table)
   *
   * NOTE: This functionality works only on the Mobile(< XLARGE)
   */
  private onToTopButtonClick(): void {
    const newActiveParagraphId = this.paragraphs[0].id;

    this.scrollController.scrollToAsync(this.getElementAbsoluteYCoordinate(this.element));
    this.contentTableController?.activeContentTable.changeActiveItem(newActiveParagraphId);
    updateHash(`#${newActiveParagraphId}`);
  }

  private isDeviceStateMobile({ state }: IDeviceStateData): boolean {
    return state <= mq.deviceState.LARGE;
  }

  private onDeviceStateChange(deviceStateData: IDeviceStateData): void {
    this.isMobile = this.isDeviceStateMobile(deviceStateData);
  }
}
