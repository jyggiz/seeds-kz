import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { O09ModalCarouselContentItem } from '../../organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import { O35ArticleCardProps } from '../../organism/o35-article-card/O35ArticleCard.types';

export type C100CardsProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;

  cards: ReadonlyArray<
    O09ModalCarouselContentItem & {
      outerContent: O35ArticleCardProps;
    }
  >;
};
