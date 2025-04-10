import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { ImageRatios } from '../../../data/type/ImageRatios';
import { A19VideoProps } from 'app/component/atom/a19-video/A19Video.types';

export type O32GalleryCardProps = {
  copy?: string;
  image?: A01ImageProps;
  variant: ImageRatios;
  preview?: A19VideoProps;
  video?: A19VideoProps;
  hasFullscreenButton?: boolean;
};
