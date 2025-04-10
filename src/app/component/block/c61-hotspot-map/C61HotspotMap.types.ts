import { O67ModalListViewerProps } from 'app/component/organism/o67-modal-list-viewer/O67ModalListViewer.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { M42OverlayBackgroundProps } from '../../molecule/m42-overlay-background/M42OverlayBackground.types';

enum C61IntroTypes {
  VIDEO = 'video',
  IMAGE = 'image',
}

type Coordinates = {
  x: number;
  y: number;
};

export type C61HotspotMapProps = {
  id?: string;
  scrollComponent?: boolean;
  static?: boolean;
  hotspots: ReadonlyArray<C61HotspotMapItem>;
  intro?: C61ImageIntro | C61VideoIntro;
  modalList?: O67ModalListViewerProps;
  map: A01ImageProps;
  overlay: M42OverlayBackgroundProps;
  startPosition: Coordinates;
  alternateHotspotStyle?: boolean;
  regions?: ReadonlyArray<C61Region>;
  stopExploringButton?: M02ButtonProps;
  discoverLocationsButton?: M02ButtonProps;
};

export interface C61Region {
  id: string;
  description: {
    label: string;
    copy: string;
    offset: Coordinates;
  };
  cta: Omit<M02ButtonProps, 'href'> & {
    offset: Coordinates;
  };
  image: A01ImageProps;
}

interface C61IntroStep {
  caption: string;
  image: A01ImageProps;
}

interface C61VideoIntro {
  type: C61IntroTypes.VIDEO;
  video: A19VideoProps;
  steps: ReadonlyArray<Omit<C61IntroStep, 'image'>>;
}

interface C61ImageIntro {
  type: C61IntroTypes.IMAGE;
  steps: ReadonlyArray<C61IntroStep>;
}

export interface C61HotspotMapItem {
  active?: boolean;
  offset: Coordinates;
  image: A01ImageProps;
  heading: Omit<A03HeadingProps, 'size' | 'element'>;
  copy: string;
  buttons?: ReadonlyArray<M02ButtonProps>;
  regionId?: string;
}
