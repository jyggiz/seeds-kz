import { M02ButtonProps } from '../m02-button/M02Button.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { ImageRatios } from '../../../data/type/ImageRatios';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';

export type M46MediaCardProps = {
  cta: M02ButtonProps;
  id?: string;
  image: A01ImageProps;
  meta?: {
    date: string;
    section: string;
  };
  scrollComponent?: boolean;
  title: string;
  variant: ImageRatios;
  video?: Omit<A19VideoProps, 'autoloop'>;
};
