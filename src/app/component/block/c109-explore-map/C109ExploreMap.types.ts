import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';
import { O66IntroStepsProps } from 'app/component/organism/o66-intro-steps/O66IntroSteps.types';
import { O65MobileInstructionsProps } from 'app/component/organism/o65-mobile-instructions/O65MobileInstructions.types';
import {
  O64HotspotContent,
  O64HotspotMapItem,
  O64HotspotMapProps,
} from 'app/component/organism/o64-hotspot-map/O64HotspotMap.types';
import { M26Themes } from 'app/component/molecule/m26-hotspot-button/M26HotspotButton.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type C109MapItem = Omit<O64HotspotMapItem, 'content'> & {
  content: O64HotspotContent;
  tag: string;
};

type TagItem = {
  id: string;
  name: string;
  icon: string;
  color: M26Themes;
  active?: boolean; // default is true
};

export type C109Tags = {
  label: string;
  returnButtonLabel: string;
  items: ReadonlyArray<TagItem>;
};

export type C109ExploreMapProps = Omit<O64HotspotMapProps, 'items'> & {
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  introductionSlide: M18ParagraphProps;
  intro: O66IntroStepsProps;
  mobileInstructions: O65MobileInstructionsProps;
  stopExploringButton: M02ButtonProps;
  items: ReadonlyArray<C109MapItem>;
  tags?: C109Tags;
};
