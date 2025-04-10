import { HoverableCardProps } from './component/molecule/hoverable-card/HoverableCard.types';

export type O102CardsGridProps = {
  id?: string;
  scrollComponent?: boolean;
  variant?: 'fullWidth';
  data?: Record<string, string>;
  items: ReadonlyArray<HoverableCardProps>;
};
