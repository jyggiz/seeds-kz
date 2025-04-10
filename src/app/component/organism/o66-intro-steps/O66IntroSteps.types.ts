import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';

export type O66IntroStepsProps = {
  id?: string;
  scrollComponent?: boolean;
  type?: string;
  video?: A19VideoProps;
  steps: {
    caption: string;
    image?: A01ImageProps;
  };
};
