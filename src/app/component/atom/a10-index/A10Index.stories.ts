export default {
  title: 'NEOM/atom/A10 Index',
  component: require('./A10Index'),
  argTypes: {
    index: {
      control: {
        type: 'range',
        min: 1,
        max: 99,
      },
      description: 'Sets index number (zero padded from 1 to 9).',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an outlined Index asset.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a10-index @root}}
    </hbs>`,
});

Default.args = {
  index: 1,
};
