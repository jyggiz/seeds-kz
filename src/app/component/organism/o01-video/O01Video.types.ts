export type O01VideoProps = {
  data?: Object;
  props: O01VideoConfig;
};

export type Timing = {
  label: string;
  start: number;
  end: number;
};

export type O01VideoConfig = {
  eventTracking?: {
    event: 'video_start';
    video: {
      src: string;
      title: string;
      titleInEnglish: string;
    };
  };
  timings: ReadonlyArray<Timing>;
  autoplay: boolean;
  cover: boolean;
  controls:
    | boolean
    | {
        fullscreen: boolean;
        play: boolean;
        pause: boolean;
        time: boolean;
        seek: boolean;
      };
  disablePreload: boolean;
  loop: boolean;
  muted: boolean;
  originalWidth?: number;
  originalHeight?: number;
  sources?: Array<{
    src: string;
    type: 'type/mp4' | 'type/webm';
  }>;
  vimeo: string;
  youtube: string;
  copy: {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    enterFullScreen: string;
    exitFullScreen: string;
  };
};
