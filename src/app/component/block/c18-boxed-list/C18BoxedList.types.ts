import { M03StickyMediaProps } from '../../molecule/m03-sticky-media/M03StickyMedia.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import {
  O34BoxedCardProps,
  O34BoxedCardVariants,
} from '../../organism/o34-boxed-card/O34BoxedCard.types';
import { HorizontalAlignmentTypes } from '../../../data/interface/Alignment';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import O11ModalContentProps from '../../organism/o11-modal-content/O11ModalContent.types';

export type C18BoxedListProps = {
  align: HorizontalAlignmentTypes;
  backgroundColor?: NeomThemeBackgroundColors;
  background?: M03StickyMediaProps;
  theme?: NeomComponentThemes;
  fullMinHeight?: boolean;
  padding?: BlockPaddingProps;
  scrollComponent: boolean;
  variant?: O34BoxedCardVariants;
  header: M04ComponentHeaderProps;
  items: Array<O34BoxedCardProps & Partial<O11ModalContentProps>>;
};
