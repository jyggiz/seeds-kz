import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';

export type O93BlockCtaProps = {
  type?: 'modal' | 'link'; // default is none
  id?: HTMLElement['id'];
  scrollComponent?: boolean;
  heading: string;
  description: string;
  label: string;
  background: M34ComponentBackgroundProps;
  icon?: string;
  href?: string;
  target?: '_self' | '_blank';
};

export enum O93BlockCtaTypes {
  MODAL = 'modal',
  LINK = 'link',
}
