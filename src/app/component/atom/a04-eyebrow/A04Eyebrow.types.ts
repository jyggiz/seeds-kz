import { TextTransform } from 'app/data/type/TextTransformations';

export type A04EyebrowSizes = 'small' | 'medium' | 'large' | 'xlarge'; // large default when undefined

type A04EyebrowProps = {
  size: A04EyebrowSizes;
  text: string;
  variant?: string; // not user-facing
  transform?: TextTransform;
};

export default A04EyebrowProps;
