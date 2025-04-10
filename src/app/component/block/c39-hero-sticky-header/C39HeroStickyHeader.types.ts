import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';
import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';

export type C39HeroStickyHeaderProps = {
  scrollComponent?: boolean;
  id?: string;
  heading: A03HeadingProps;
  background?: M34ComponentBackgroundProps;
  buttonsAlignment?: 'start' | 'middle' | 'end';
  buttons?: ReadonlyArray<M02ButtonProps>;
  content?: M18ParagraphProps;
  staticFontSize?: boolean;
};
