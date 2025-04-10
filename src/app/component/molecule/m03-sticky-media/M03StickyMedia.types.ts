import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { O01VideoConfig } from '../../organism/o01-video/O01Video.types';

export type M03StickyMediaProps = {
  image?: A01ImageProps;
  video?: {
    props: O01VideoConfig;
  };
};
