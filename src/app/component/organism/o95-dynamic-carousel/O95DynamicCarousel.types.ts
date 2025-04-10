export type O95DynamicCarouselProps = {
  id?: string;
  items: O95Item[];
};

export type O95Item = {
  componentName: string;
  data: {
    [key: string]: unknown;
  };
};
