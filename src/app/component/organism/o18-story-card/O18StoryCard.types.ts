import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { O01VideoProps } from '../o01-video/O01Video.types';

export type O18StoryCardProps = {
  image: A01ImageProps;
  subTitle: string;
  title: string;
  video?: O01VideoProps;
};

export default O18StoryCardProps;
