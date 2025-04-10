import O53Data from './data/default.yaml';

export default {
  title: 'NEOM/organism/O53 Text Asset',
  component: require('./O53TextAsset.lazy'),
  argTypes: {
    assetFirst: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between having the image in the start column on desktop or not.',
    },
    assetPull: {
      control: {
        type: 'boolean',
      },
      description:
        'Toggles the repositioning of text and asset. When true, the image is wider than the content and pulls out of the container boundaries.',
    },
    type: {
      control: { type: 'select', options: ['paragraph', 'list'] },
      description: 'Specifies the type of text molecule is required',
    },
    text: {
      control: {
        type: 'object',
      },
      description: '',
    },
    asset: {
      control: {
        type: 'object',
      },
      description: '',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a Text and Asset block',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
     {{> o53-text-asset }}
 </hbs>`,
});

Default.args = O53Data;
