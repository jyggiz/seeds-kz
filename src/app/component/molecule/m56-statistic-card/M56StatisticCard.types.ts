type FigureSize = 'small' | 'medium' | 'large';

type Figure = {
  value?: string;
  measure?: string;
  icon?: string;
  label: string;
  size?: FigureSize; // Default is large
};

export type M56StatisticCardProps = {
  id?: string;
  scrollComponent?: boolean;
  figures: ReadonlyArray<Figure>;
};
