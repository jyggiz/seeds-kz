import { A01ImageProps } from '../../atom/a01-image/A01Image.types';

type Copy = {
  text: string;
  size?: 'small' | 'medium' | 'large'; // 'small' is default
};

export type M13HighlightItemProps = {
  image?: A01ImageProps;
  title?: Copy;
  description?: Copy;
};

export default M13HighlightItemProps;
