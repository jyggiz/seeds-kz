import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';
import { O32GalleryCardProps } from 'app/component/organism/o32-gallery-card/O32GalleryCard.types';

export enum CarouselComponents {
  O32 = 'o32-gallery-card',
  TextCard = 'text-card',
}

export type C113SimpleCardCarouselProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  items: ReadonlyArray<TextCardProps | O32Props>;
};

type O32Props = {
  componentName: CarouselComponents.O32;
  data: O32GalleryCardProps;
};

type TextCardProps = {
  componentName: CarouselComponents.TextCard;
  buttons: ReadonlyArray<M02Button>;
} & M18ParagraphProps;
