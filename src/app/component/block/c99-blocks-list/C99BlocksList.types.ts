import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M18ParagraphProps } from 'app/component/molecule/m18-paragraph/M18Paragraph.types';
import { O93BlockCtaProps } from 'app/component/organism/o93-block-cta/O93BlockCta.types';

export type C99BlocksListProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: HTMLElement['id'];
  scrollComponent?: boolean;
  title: M18ParagraphProps;
  blocks: ReadonlyArray<O93BlockCtaProps>;
};
