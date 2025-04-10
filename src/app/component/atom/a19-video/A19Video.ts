import debounce from 'lodash-es/debounce';
import AbstractComponent from 'app/component/AbstractComponent';
import { TweenLite } from 'gsap';

export default class A19Video extends AbstractComponent {
  public static readonly displayName: string = 'a19-video';

  private readonly video = this.getElement<HTMLVideoElement>('[data-video]');
  private readonly _sources = this.video && this.getElements<HTMLSourceElement>('source');
  private readonly enhancedPoster: HTMLImageElement | null = this.getElement('[data-video-poster]');
  private readonly isAutoplayed = this.videoElement.autoplay;
  private isLazy: boolean = 'lazy' in this.element.dataset;

  constructor(el: HTMLElement) {
    super(el);

    this.loadNextPlayableSource();
    this.addDisposableEventListener(
      window,
      'resize',
      debounce(this.loadNextPlayableSource.bind(this), 100),
    );

    if (this.isLazy) {
      this.observeLazyVideo();
    }

    if (this.enhancedPoster) {
      if (this.isAutoplayed) {
        this.addDisposableEventListener(
          this.videoElement,
          'canplaythrough',
          this.hideEnhancedPoster.bind(this),
        );
      } else {
        this.addDisposableEventListener(
          this.videoElement,
          'play',
          this.hideEnhancedPoster.bind(this),
        );
      }
    }
  }

  private get videoElement(): HTMLVideoElement {
    if (!this.video) {
      throw new Error("Video Element doesn't exist!");
    }

    return this.video;
  }

  private get sources(): readonly HTMLSourceElement[] {
    if (!this._sources) {
      throw new Error("Source Elements don't exist!");
    }

    return this._sources;
  }

  private get enhancedPosterElement(): HTMLImageElement {
    if (!this.enhancedPoster) {
      throw new Error('Could not find enhanced poster!');
    }

    return this.enhancedPoster;
  }

  private hideEnhancedPoster() {
    TweenLite.to(this.enhancedPosterElement, 0, { opacity: 0 });
  }

  private loadNextPlayableSource(): void {
    const nextPlayableSource = this.getNextPlayableSource();

    if (this.videoElement.src !== nextPlayableSource) {
      this.setVideoSource(this.videoElement, nextPlayableSource);
    }
  }

  private getNextPlayableSource(): string {
    const responsiveSrc = this.findSource(
      (media: string) => Boolean(media) && window.matchMedia(media).matches,
    );
    const nextFallbackSrc = this.findSource((media: string) => !media);

    return responsiveSrc || nextFallbackSrc;
  }

  private findSource(isMatchedSource: (media: string) => boolean): string {
    const matchedSourceElement: HTMLSourceElement | undefined = this.sources.find(
      ({ type, media }) => this.videoElement.canPlayType(type) && isMatchedSource(media),
    );

    return matchedSourceElement ? this.getSource(matchedSourceElement) : '';
  }

  private setVideoSource(mediaElement: HTMLVideoElement, source: string): void {
    if (this.isLazy) {
      mediaElement.dataset.src = source;
    } else {
      mediaElement.src = source;
    }
  }

  private setSrcFromDataSrc(sourceElement: HTMLSourceElement) {
    sourceElement.src = sourceElement.dataset.src || '';
    sourceElement.dataset.src = '';
  }

  private getSource(mediaElement: HTMLSourceElement): string {
    if (this.isLazy) {
      return mediaElement.dataset.src || '';
    }
    return mediaElement.src;
  }

  public loadVideo(): void {
    if (!this.isLazy) return;

    this.isLazy = false;

    this.setVideoSource(this.videoElement, this.videoElement.dataset.src || '');

    this.sources.forEach(this.setSrcFromDataSrc);

    this.videoElement.load();

    delete this.element.dataset.lazy;
  }

  public observeLazyVideo(): void {
    const lazyVideoObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadVideo();

          lazyVideoObserver.unobserve(this.element);
        }
      },
      { threshold: 0.1 },
    );

    lazyVideoObserver.observe(this.element);
  }
}
