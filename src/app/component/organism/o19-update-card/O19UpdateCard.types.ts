import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { O01VideoConfig } from '../../organism/o01-video/O01Video.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { TextTransform } from 'app/data/type/TextTransformations';
import { ContentScopeSizes } from 'app/data/type/Scopes';

export type O19UpdateCardProps = {
  variant?: 'social' | 'video' | 'article';
  heading: Array<{
    text: string;
    title?: {
      copy: string;
      size?: ContentScopeSizes;
      transform?: TextTransform;
    };
  }>;
  externalLink?: string;
  callToAction?: Array<M02ButtonProps>;
  image: A01ImageProps;
  socialMediaIcon?: 'instagram';
  video: {
    label: string;
    props: O01VideoConfig;
  };
};
