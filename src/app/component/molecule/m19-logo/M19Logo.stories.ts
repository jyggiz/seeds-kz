import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M19LogoProps from './M19Logo.types';
import M19LogoDefaultData from '../m19-logo/data/default.yaml';
import M19LogoDarkData from '../m19-logo/data/dark-mark.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const flattenedDefaultData = flattenProps(M19LogoDefaultData);
const flattenedDarkData = flattenProps(M19LogoDarkData);

const flattenedArgTypes = [flattenedDefaultData, flattenedDarkData].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

export default {
  title: 'NEOM/molecule/M19 Logo',
  component: require('./M19Logo'),
  argTypes: flattenedArgTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders logo image.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m19-logo }}
  </hbs>`,
});

export const Default = withMappedProps<M19LogoProps>(DefaultTemplate);
export const Dark = withMappedProps<M19LogoProps>(DefaultTemplate);

Default.args = flattenedDefaultData;
Dark.args = flattenedDarkData;
