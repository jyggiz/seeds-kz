import { A01ImageProps } from '../a01-image/A01Image.types';

export type A19VideoProps = {
  autoloop: boolean;
  lazy?: boolean;
  props: {
    autoplay: boolean;
    crossorigin?: 'anonymous' | 'use-credentials';
    loop?: boolean;
    muted?: boolean;
    playsinline?: boolean;
    src?: string;
    type?: string;
    sources: Array<{
      src: string;
      type: string;
      media?: string;
    }>;
  } & PosterOrEnhancedPoster;
};

type PosterOrEnhancedPoster =
  | {
      poster: string;
      enhancedPoster?: never;
    }
  | { enhancedPoster: A01ImageProps; poster?: never };
