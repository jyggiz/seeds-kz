import A01ImageProps from '../../atom/a01-image/A01Image.types';

type M22PersonCardProps = {
  image: A01ImageProps;
  name: string;
  role: string;
  subrole?: string;
  biography?: string;
  email?: {
    href: string;
  };
};

export default M22PersonCardProps;
