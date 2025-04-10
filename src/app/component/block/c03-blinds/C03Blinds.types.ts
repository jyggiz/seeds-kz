import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { O20BlindProps } from '../../organism/o20-blind/O20Blind.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';

export type C03BlindsProps = {
  scrollComponent?: boolean;
  id?: string;
  title?: Pick<M18ParagraphProps, 'eyebrow' | 'heading'>;
  header: M04ComponentHeaderProps & { heading: A03HeadingProps }; //heading is always required, but eyebrow is optional
  button: {
    video: string;
  };
  items: Array<O20BlindProps>;
  fullHeight?: boolean; // defaults to false
};
