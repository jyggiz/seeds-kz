export default {
  title: 'NEOM/atom/A08 Page-indicators',
  component: require('./A08PageIndicators'),
  argTypes: {
    active: {
      control: { type: 'boolean' },
      description: 'Controls active state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a page indicators',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
<div style="padding:20px;text-align: center;">{{> a08-page-indicators @root }}</div>

</hbs>`,
  data: { items: [{ active: false }, { active: true }, { active: false }, { active: false }] },
});

Default.args = {
  items: [
    {
      active: true,
    },
  ],
};
