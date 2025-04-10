import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';

export type LabelLocation = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical' | 'horizontalInverted' | 'verticalInverted';

export type C73ScrollImageContentProps = {
  id?: string;
  scrollComponent?: boolean;
  sections: ReadonlyArray<{
    theme?: 'light' | 'dark';
    labels?: ReadonlyArray<{
      label: {
        overline?: string;
        copy: string;
      };
      textAlign?: 'start' | 'center';
      direction: Direction;
      location: LabelLocation;
    }>;
    image: A01ImageProps & {
      caption?: A04EyebrowProps;
    };
    copy: {
      eyebrow: A04EyebrowProps;
      descriptions: ReadonlyArray<string>;
    };
  }>;
};
