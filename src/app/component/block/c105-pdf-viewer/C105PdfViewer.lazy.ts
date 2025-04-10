import * as pdfjs from 'pdfjs-dist';
import { PageFlip, WidgetEvent } from 'page-flip';
import { Key } from 'ts-key-enum';
import { getComponentForElement } from 'muban-core';

import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import A14Input from 'app/component/atom/a14-input/A14Input';
import {
  getFullscreenElement,
  isFullscreenEnabled,
  requestFullscreen,
} from '../../../util/fullscreenUtils';
import { isSafari } from '../../../util/browserUtils';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import A02Icon from 'app/component/atom/a02-icon/A02Icon';
import deviceStateTracker from '../../../util/deviceStateTracker';
import C00Dummy from '../c00-dummy/C00Dummy.lazy';
import { C00DummyEvent } from '../c00-dummy/C00Dummy.utils';

import './c105-pdf-viewer.scss';

enum SizeType {
  STRETCH = 'stretch',
  FIXED = 'fixed',
}

const DEFAULT_CANVAS_SIZES = {
  MOBILE: {
    height: 425,
  },
  DESKTOP: {
    height: 700,
  },
};

export default class C105PdfViewer extends AbstractComponent {
  public static readonly displayName: string = 'c105-pdf-viewer';

  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  private url = this.element.dataset.url;

  // Loaded via <script> tag, create shortcut to access PDF.js exports.

  // The workerSrc property shall be specified.

  private isMobile = deviceStateTracker.currentDeviceState.state <= 2;
  private pageFlip: PageFlip | null = null;
  private pdfDoc: pdfjs.PDFDocumentProxy | null = null;
  private scale: number = 1;
  private isFullscreen: boolean = false;
  private currentRenderingPage = 1;
  private prevButton = this.getElement('#b-pdfViewer__previousButton');
  private nextButton = this.getElement('#b-pdfViewer__nextButton');
  private bookContainer = this.getElement('.b-pdfViewer__book');
  private minimapToggleButton = this.getElement('.b-pdfViewer__minimapToggle');
  private minimapCloseButton = this.getElement('.b-pdfViewer__minimapCloseButton');
  private pageCount = this.getElement('.b-pdfViewer__paginationPageCount');
  private loader = this.getElement('.b-pdfViewer__loader');
  private topToolbar = this.getElement('[data-pdf-top-toolbar]');
  private bottomToolbar = this.getElement('[data-pdf-bottom-toolbar]');
  private canvasContainer = this.getElement<HTMLDivElement>('#canvas-container');
  private input = this.getElement<HTMLInputElement>(
    `[data-component="${A14Input.displayName}"] input`,
  );
  private fullscreenToggleButton = this.getElement('.b-pdfViewer__fullscreenToggle');
  private miniMapContainer = this.getElement('.b-pdfViewer__minimap');
  private fullscreenIconElement =
    this.fullscreenToggleButton && this.getElement('span', this.fullscreenToggleButton);
  private fullscreenIconComponent =
    this.fullscreenIconElement && getComponentForElement<A02Icon>(this.fullscreenIconElement);
  private readonly navigationDummyElement = document.querySelector(
    `[data-component="${C00Dummy.displayName}"]`,
  ) as HTMLElement;
  private readonly navigationDummyComponent =
    this.navigationDummyElement && getComponentForElement<C00Dummy>(this.navigationDummyElement);
  private isRenderedOnce = false;
  private canvasList: HTMLCanvasElement[] = [];
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor(el: HTMLElement) {
    super(el);
  }

  private async loadPdfWorker() {
    if (this.isDevelopment) {
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.js`;
      return;
    }

    const clientLibPath = '/etc.clientlibs/neom/clientlibs/clientlib-site/resources';
    const manifestPath = `${clientLibPath}/asset/asset-manifest.json`;
    const response = await fetch(manifestPath);
    const manifest = await response.json();
    const pdfWorkerFileName = 'asset/pdf.worker.js';
    const hashedPdfWorkerFileName = manifest[pdfWorkerFileName];
    pdfjs.GlobalWorkerOptions.workerSrc = `${clientLibPath}/${hashedPdfWorkerFileName}`;
  }

  public async adopted() {
    try {
      await this.loadPdfWorker();
    } catch (e) {
      console.log(e);
    }
    this.loadPdf();
    this.addEventListeners();
    this.initPageFlip();
    this.setInputValue('1');

    setAsInitialised(this.element);

    if (this.navigationDummyComponent) {
      this.addDisposableEventListener<C00DummyEvent>(
        this.navigationDummyComponent.dispatcher,
        C00DummyEvent.types.NAVIGATION_HEIGHT,
        (event) => {
          this.element.style.height = `calc(100vh - ${event.height}px)`;
        },
      );
    }
  }

  private getCanvasContainerWidth(): number {
    return Math.floor((this.getCanvasContainerHeight() * 75) / 100);
  }

  private getCanvasContainerHeight(): number {
    if (!this.element || !this.topToolbar || !this.bottomToolbar)
      return this.isMobile
        ? DEFAULT_CANVAS_SIZES.MOBILE.height
        : DEFAULT_CANVAS_SIZES.DESKTOP.height;

    return (
      Math.floor((this.element.offsetHeight * 75) / 100) -
      this.topToolbar.offsetHeight -
      this.bottomToolbar.offsetHeight
    );
  }

  private initPageFlip() {
    if (!this.canvasContainer) return;

    this.pageFlip = new PageFlip(this.canvasContainer, {
      width: this.getCanvasContainerWidth(),
      height: this.getCanvasContainerHeight(),
      size: SizeType.FIXED,
      usePortrait: this.isMobile,
      showCover: !this.isMobile,
      maxShadowOpacity: 0.5,
    });
    this.pageFlip.on('flip', (event) => {
      this.transformBook(event);
      this.updatePagination(event);
    });
  }

  private updatePagination(event: WidgetEvent) {
    if (!this.pdfDoc) {
      throw new Error('pdfDoc instance was not found');
    }

    const index = event.data as number;
    const currentPage =
      this.isMobile || index === 0 || index === this.pdfDoc.numPages - 1
        ? `${index + 1}`
        : `${index + 1} - ${index + 2}`;

    this.setInputValue(currentPage);
  }

  private transformBook(event: WidgetEvent) {
    const pageIndex = event.data as number;

    if (!this.pdfDoc) {
      throw new Error('Pdfdoc was not found');
    }

    this.canvasContainer?.classList.toggle('-isFirstPage', pageIndex === 0);
    this.canvasContainer?.classList.toggle('-isLastPage', pageIndex === this.pdfDoc.numPages - 1);
  }

  private setInputValue(value: string) {
    if (!this.input) {
      throw new Error('input element was not found');
    }

    this.input.value = value;
  }

  private initPageFlipItems(pages: HTMLCanvasElement[]) {
    if (!this.canvasContainer) return;
    this.pageFlip?.loadFromHTML(pages);
    this.loader?.classList.add(StateClassNames.HIDDEN);
    this.bookContainer?.classList.add(StateClassNames.VISIBLE);
  }
  /**
   * Displays previous page.
   */
  private onPreviousPage(): void {
    this.pageFlip?.flipPrev();
  }

  /**
   * Displays next page.
   */
  private onNextPage(): void {
    this.pageFlip?.flipNext();
  }

  /**
   * Asynchronously downloads PDF.
   */
  private loadPdf(): void {
    if (!this.url) {
      throw new Error('Url has not been provided');
    }

    pdfjs.getDocument(this.url).promise.then((pdfDocController) => {
      this.pdfDoc = pdfDocController;

      if (!this.pageCount) {
        throw new Error('Page Count');
      }

      this.pageCount.textContent = String(this.pdfDoc?.numPages);

      // Initial/first page rendering
      this.renderPage(1);
    });
  }

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  private renderPage(num: number): void {
    this.pdfDoc?.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });

      if (!ctx) {
        throw new Error("Canvas context wasn't found");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      const renderTask = page.render(renderContext);

      this.renderMiniMapItem(num, canvas.cloneNode(), page);

      this.canvasList = [...this.canvasList, canvas];

      // this.pageFlip?.updateFromHtml([canvas]);
      // Wait for the current page to render then render next one
      renderTask.promise
        .then(() => {
          this.currentRenderingPage++;

          if (this.pdfDoc === null || this.currentRenderingPage > this.pdfDoc.numPages) {
            return;
          }

          if (this.isRenderedOnce) {
            this.pageFlip?.updateFromHtml(this.canvasList);
          } else if (this.canvasList.length > 1) {
            this.initPageFlipItems(this.canvasList);
            this.isRenderedOnce = true;
          }
        })
        .then(() => {
          if (this.pdfDoc !== null && this.currentRenderingPage <= this.pdfDoc.numPages) {
            this.renderPage(this.currentRenderingPage);
          }
        });
    });
  }

  private renderMiniMapItem(num: number, canvas: Node, page: any): void {
    if (!this.miniMapContainer) {
      throw new Error('Mini map container doesnt exist');
    }

    const currentCanvas = canvas as HTMLCanvasElement;

    const pageNumber = num;

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page-container');
    const canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('canvas-wrapper');
    currentCanvas.style.display = 'block';
    const context = currentCanvas.getContext('2d');
    currentCanvas.height = 125;
    currentCanvas.width = 95;

    const pageIndexElement = document.createElement('span');
    pageIndexElement.textContent = String(pageNumber);

    const viewport = page.getViewport({ scale: 0.16 });

    if (!context) {
      throw new Error('Canvas context doesnt exist');
    }

    page.render({ canvasContext: context, viewport });

    this.addDisposableEventListener(pageContainer, 'click', () => {
      this.pageFlip?.flip(pageNumber - 1);
      if (this.isMobile) {
        this.toggleMinimap();
      }
    });

    canvasWrapper.appendChild(currentCanvas);
    pageContainer.appendChild(canvasWrapper);
    pageContainer.appendChild(pageIndexElement);
    this.miniMapContainer.appendChild(pageContainer);
  }

  private toggleMinimap() {
    this.miniMapContainer?.classList.toggle(StateClassNames.OPEN);
    this.minimapToggleButton?.classList.toggle(StateClassNames.OPEN);
  }

  private async toggleFullscreen(): Promise<void> {
    if (this.isFullscreen) {
      const fullscreenElement = getFullscreenElement();

      this.fullscreenIconComponent?.setIcon('open-full-screen');
      if (fullscreenElement === this.element) {
        document.exitFullscreen();
      }
    } else {
      if (!isFullscreenEnabled()) {
        throw new Error('Unable to request fullscreen');
      }

      if (isSafari()) {
        this.element.webkitRequestFullscreen();
        return;
      }
      this.fullscreenIconComponent?.setIcon('exit-full-screen');
      await requestFullscreen(this.element);
    }

    this.fullscreenToggleButton?.classList.toggle(StateClassNames.OPEN);
  }

  private onInputKeyPress(event: KeyboardEvent) {
    if (event.key !== Key.Enter) return;

    const inputValue = parseInt((event.currentTarget as HTMLInputElement)?.value);
    const newPageIndex = isNaN(inputValue) ? 0 : inputValue - 1;

    this.pageFlip?.flip(newPageIndex);
  }

  private onArrowKeyPress(event: KeyboardEvent) {
    if (event.key === Key.ArrowRight) {
      this.pageFlip?.flipNext();
    }
    if (event.key === Key.ArrowLeft) {
      this.pageFlip?.flipPrev();
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.element, 'keydown', this.onArrowKeyPress.bind(this));
    this.minimapToggleButton &&
      this.addDisposableEventListener(
        this.minimapToggleButton,
        'click',
        this.toggleMinimap.bind(this),
      );
    this.minimapCloseButton &&
      this.addDisposableEventListener(
        this.minimapCloseButton,
        'click',
        this.toggleMinimap.bind(this),
      );
    this.prevButton &&
      this.addDisposableEventListener(this.prevButton, 'click', this.onPreviousPage.bind(this));
    this.nextButton &&
      this.addDisposableEventListener(this.nextButton, 'click', this.onNextPage.bind(this));
    this.input &&
      this.addDisposableEventListener(this.input, 'keydown', this.onInputKeyPress.bind(this));
    this.fullscreenToggleButton &&
      this.addDisposableEventListener(
        this.fullscreenToggleButton,
        'click',
        this.toggleFullscreen.bind(this),
      );
    this.addDisposableEventListener(this.element, 'fullscreenchange', () => {
      this.isFullscreen = !this.isFullscreen;
    });
  }
}
