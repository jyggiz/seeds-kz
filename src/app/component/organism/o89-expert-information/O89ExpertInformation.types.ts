import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

export type O89ExpertInformationProps = {
  id?: string;
  heading: A03HeadingProps;
  role: string;
  image: A01ImageProps;
  video?: A19VideoProps;
};
