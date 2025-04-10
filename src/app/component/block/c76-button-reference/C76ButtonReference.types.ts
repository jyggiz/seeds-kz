import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';
import { M02ButtonLevel } from 'app/component/molecule/m02-button/M02Button.types';
import { M02ButtonTheme } from 'app/component/molecule/m02-button/M02Button.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

type M18CopyProps = Required<Pick<M18ParagraphProps, 'copy'>>;

type M02IconAlignment = Pick<M02ButtonProps, 'iconAlignment'>;

type Variant = 'other';

type M02Example = {
  heading: {
    text: string;
  };
  theme: M02ButtonTheme; // todo: fix conflict theme - component vs button
  level: M02ButtonLevel;
  items: Array<{
    label?: string;
    icon?: string;
    iconAlignment?: M02IconAlignment;
  }>;
};

type OtherVariantExample = {
  heading: {
    text: string;
  };
  id: string;
  hideOnMobile?: boolean;
  theme?: NeomComponentThemes;
  example?: any; // Each example uses different props depending on the component we want to render.
};

export type C76ButtonReferenceProps = {
  id?: string;
  scrollComponent?: boolean;
  heading: A03HeadingProps;
  copy: M18CopyProps['copy'];
  variant?: Variant;
  examples: Array<M02Example | OtherVariantExample>;
};
