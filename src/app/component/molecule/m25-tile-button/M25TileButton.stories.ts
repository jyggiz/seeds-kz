import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M25TileButtonProps } from './M25TileButton.types';
import M25NextData from '../m25-tile-button/data/example-next.yaml';
import M25NextLongTextData from '../m25-tile-button/data/example-next-long-text.yaml';
import M25PreviousData from '../m25-tile-button/data/example-previous.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

const flattenedNextData = flattenProps(M25NextData);
const flattenedNextLongData = flattenProps(M25NextLongTextData);
const flattenedPreviousData = flattenProps(M25PreviousData);

const flattenedArgTypes = [flattenedNextData, flattenedNextLongData, flattenedPreviousData].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

export default {
  title: 'NEOM/molecule/M25 Tile Button',
  component: require('./M25TileButton'),
  argTypes: {
    ...flattenedArgTypes,
    variant: {
      control: { type: 'select', options: ['previous', 'next'] },
      description: 'Content alignment type.',
    },
    theme: {
      control: { type: 'select', options: ['dark', 'darkMono'] },
      description: 'Theme color.',
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Icon name.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders molecule with content and link as navigation.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m25-tile-button }}
  </hbs>`,
});

export const Next = withMappedProps<M25TileButtonProps>(DefaultTemplate);
export const NextLongText = withMappedProps<M25TileButtonProps>(DefaultTemplate);
export const Previous = withMappedProps<M25TileButtonProps>(DefaultTemplate);

Next.args = flattenedNextData;
NextLongText.args = flattenedNextLongData;
Previous.args = flattenedPreviousData;
