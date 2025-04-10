import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M11SectorButtonProps from './M11SectorButton.types';
import M11DefaultData from './data/default.yaml';

const flattenedDataDefaultExample = flattenProps(M11DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M11 Sector Button',
  component: require('./M11SectorButton'),
  argTypes: {
    ...flattenedPropsTypes,
    icon: {
      control: {
        type: 'select',
        options: [
          'energy',
          'water',
          'mobility',
          'entertainment-culture',
          'food',
          'manufacturing',
          'media',
          'tourism',
          'sport',
          'design-construction',
          'services',
          'health-wellbeing-biotech',
          'education',
          'technology-digital',
        ],
      },
      description: 'Icon',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders sector button with icon, image and text inside ',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    <style>
      :root {
        --color-storybook-background: var(--color-tonomus-purple-200);
      }
    </style>
    {{> m11-sector-button }}
  </hbs>`,
});

export const Default = withMappedProps<M11SectorButtonProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
