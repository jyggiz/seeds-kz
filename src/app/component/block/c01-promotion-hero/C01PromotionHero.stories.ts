import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C01PromotionHeroData from './data/en.yaml';

const flattenedData = flattenProps(C01PromotionHeroData);
const flattenedPropsTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/block/C01PromotionHero',
  component: require('./C01PromotionHero'),
  argTypes: {
    ...flattenedPropsTypes,
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a hero component.',
      },
    },
  },
};

const Template = () => {
  return {
    template: `<hbs>
     {{> c01-promotion-hero }}
    </hbs>`,
  };
};

export const Default = withMappedProps(Template);

Default.args = flattenedData;
