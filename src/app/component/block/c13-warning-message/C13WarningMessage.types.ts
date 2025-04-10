import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

export type C13WarningMessageProps = {
  logo: {
    href: string;
    image: A01ImageProps;
  };

  items: Array<{
    language: string; // defaults to 'en' when undefined.
    direction: 'ltr' | 'rtl'; //defaults to 'ltr' when undefined.
    eyebrow: A04EyebrowProps;
    heading: A03HeadingProps;
    description: string;
  }>;
  theme?: NeomComponentThemes;
};
