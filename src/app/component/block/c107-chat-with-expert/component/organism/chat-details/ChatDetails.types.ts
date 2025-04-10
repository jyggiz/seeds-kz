import A03HeadingProps from '../../../../../atom/a03-heading/A03Heading.types';

export type ChatQnaProps = {
  question: string;
  answer: string;
};

export type ChatDetailsProps = {
  items: Array<ChatQnaProps>;
  expertInterviewHeading: Pick<A03HeadingProps, 'text' | 'size'>;
};
