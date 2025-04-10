import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M35FactProps } from './M35Fact.types';
import M35FactData from './data/example-fact.yaml';
import M35FigureData from './data/example-figure.yaml';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataFactExample = flattenProps(M35FactData);
const flattenedDataFigureExample = flattenProps(M35FigureData);
const flattenedArgTypes = [flattenedDataFactExample, flattenedDataFigureExample].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M35 Fact',
  component: require('./M35Fact'),
  argTypes: {
    ...flattenedArgTypes,
    type: {
      control: { type: 'select', options: ['', 'icons'] },
      description: 'Specifies type of fact.If icons selected, it will hide value.',
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies icon.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders the block with icon/number units and copy.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m35-fact }}
  </hbs>`,
});

export const Fact = withMappedProps<M35FactProps>(DefaultTemplate);
export const Figure = withMappedProps<M35FactProps>(DefaultTemplate);

Fact.args = flattenedDataFactExample;
Figure.args = flattenedDataFigureExample;
