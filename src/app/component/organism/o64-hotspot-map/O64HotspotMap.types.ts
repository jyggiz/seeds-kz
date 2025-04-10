import { A19VideoProps } from 'app/component/atom/a19-video/A19Video.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import { M42OverlayBackgroundProps } from 'app/component/molecule/m42-overlay-background/M42OverlayBackground.types';
import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { A28ScaleProps } from '../../atom/a28-scale/A28Scale.types';
import { M26Themes } from '../../molecule/m26-hotspot-button/M26HotspotButton.types';
import { O01VideoProps } from '../o01-video/O01Video.types';
import { C61Region } from 'app/component/block/c61-hotspot-map/C61HotspotMap.types';

export type O64HotspotMapItem = {
  id?: string;
  scrollComponent?: boolean;
  active?: boolean;
  content: O64HotspotContent | ReadonlyArray<O64HotspotContent>;
  icon?: string;
  theme?: M26Themes;
  offset: {
    x: number;
    y: number;
  };
  regionId: string;
};

export type O64HotspotContent = {
  heading: {
    text: string;
  };
  copy?: string;
  buttons?: Array<M02ButtonProps>;
  preview?: A19VideoProps;
  image?: A01ImageProps;
  video?: O01VideoProps;
  alternateHotspotStyle?: boolean;
  features?: ReadonlyArray<string>;
};

export type O64HotspotMapProps = {
  static?: boolean;
  scrollComponent?: boolean;
  mapBackground: A01ImageProps;
  overlayBackgrounds: M42OverlayBackgroundProps;
  scale?: A28ScaleProps;
  items: ReadonlyArray<O64HotspotMapItem>;
  regions?: ReadonlyArray<C61Region>;
  xAxisMobileOffset?: number;
};
