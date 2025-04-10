export type M09RichQuoteThumbnailDirections = 'next' | 'previous';

export type M09RichQuoteThumbnailProps = {
  quote: Array<{
    author: Array<{
      name: string;
      role: string;
    }>;
  }>;
  direction: M09RichQuoteThumbnailDirections;
  thumbnail: Array<{
    src: string;
    alt: string;
  }>;
};

export default M09RichQuoteThumbnailProps;
