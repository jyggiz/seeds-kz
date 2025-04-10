export default {
  title: 'NEOM/molecule/M50 Search Field',
  component: require('./M50SearchField'),
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Renders hardcoded search field.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
    {{> m50-search-field }}
  </hbs>`,
});

Default.args = {};
