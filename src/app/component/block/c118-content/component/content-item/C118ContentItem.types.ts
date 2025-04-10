import { A19VideoProps } from '../../../../atom/a19-video/A19Video.types';
import { M02ButtonProps } from '../../../../molecule/m02-button/M02Button.types';
import M16FigureProps from '../../../../molecule/m16-figure/M16Figure.types';
import M17ListProps from '../../../../molecule/m17-list/M17List.types';
import M18ParagraphProps from '../../../../molecule/m18-paragraph/M18Paragraph.types';
import { M58PillarCtaProps } from '../../../../molecule/m58-pillar-cta/M58PillarCta.types';
import { O101VideoContentProps } from '../../../../organism/o101-video-content/O101VideoContent.types';

export type C118ContentItemProps = {
  type?: 'paragraph' | 'asset';
  alignment?: {
    horizontal: 'start' | 'center' | 'end';
  };
  imageMaxWidth?: string;
  content: M16 | M17 | M18 | A19 | O101;
  buttons?: {
    type?: 'pillar';
    contentButtons: Array<M02 | M58>;
  };
};

type M16 = {
  componentName: ContentComponents.M16;
  data: M16FigureProps;
};

type M17 = {
  componentName: ContentComponents.M17;
  data: M17ListProps;
};

type M18 = {
  componentName: ContentComponents.M18;
  data: M18ParagraphProps;
};

type A19 = {
  componentName: ContentComponents.A19;
  data: A19VideoProps;
};

type O101 = {
  componentName: ContentComponents.O101;
  data: O101VideoContentProps;
};

type M02 = {
  componentName: ButtonComponents.M02;
  data: M02ButtonProps;
};

type M58 = {
  componentName: ButtonComponents.M58;
  data: M58PillarCtaProps;
};

export enum ContentComponents {
  M16 = 'm16-figure',
  M17 = 'm17-list',
  M18 = 'm18-paragraph',
  A19 = 'a19-video',
  O101 = 'o101-video-content',
}

export enum ButtonComponents {
  M02 = 'm02-button',
  M58 = 'm58-pillar-cta',
}
