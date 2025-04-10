import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';

export type C67ScrollStoriesProps = {
  id?: string;
  scrollComponent?: boolean;
  items: ReadonlyArray<{
    align: {
      horizontal: 'left' | 'center' | 'right' | 'spread';
      vertical: 'top' | 'middle' | 'bottom';
    };
    image: A01ImageProps;
    content: M18ParagraphProps;
  }>;
};
