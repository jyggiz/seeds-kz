import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type C119DraggableGalleryProps = {
  id?: string;

  copy: {
    grid: string;
    slider: string;
    drag: string;
    click: string;
    view: string;
  };

  items: Array<{
    image: A01ImageProps;
    title: A03HeadingProps;
    eyebrow?: A04EyebrowProps;
    cta: M02ButtonProps;

    about: {
      title: string;
      date: string;
      description?: string;
      image: A01ImageProps;
    };

    tabs: Array<{
      title: string;
      details: Array<{
        label: string;
        copy: string;
      }>;
    }>;
  }>;
};
