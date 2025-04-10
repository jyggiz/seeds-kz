import A01ImageProps from '../../../../../atom/a01-image/A01Image.types';
import M12Social from '../../../../../molecule/m12-social/M12Social';

export type AuthorSectionProps = {
  label: string;
  image: A01ImageProps;
  name: string;
  position: string;
  social?: M12Social;
  description?: string;
};
