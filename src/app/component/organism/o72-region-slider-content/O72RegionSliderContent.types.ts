import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';

export type O72RegionSliderContentProps = {
  items: C05RegionAssetList | C05RegionDefaultList;
};

type C05RegionAssetList = [
  C05RegionItemProperties,
  C05RegionItemProperties,
  C05RegionItemProperties,
  C05RegionItemProperties,
];
type C05RegionDefaultList = [
  C05RegionItemDefault,
  C05RegionItemDefault,
  C05RegionItemDefault,
  C05RegionItemDefault,
];

interface C05RegionItemBase {
  images: {
    background: A01ImageProps;
    region: A01ImageProps;
  };
}

interface C05RegionItemProperties extends C05RegionItemBase {
  variant: string;
  header: M04ComponentHeader;
  description: string;
  properties: ReadonlyArray<[C05RegionProperties, C05RegionProperties, C05RegionProperties]>;
}

interface C05RegionItemDefault extends C05RegionItemBase {
  contentHeader: M18ParagraphProps;
}

interface C05RegionProperties {
  items: ReadonlyArray<[C05RegionProperty, C05RegionProperty]>;
}

interface C05RegionProperty {
  image: A01ImageProps;
  heading: string;
  description: string;
}
