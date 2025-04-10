/* eslint-disable no-template-curly-in-string,global-require */
import M01DataRoyal from './data/example-royal-small.yaml';
import M01DataExample from './data/example.yaml';
import M01DataTestimonial from './data/example-testimonial.yaml';

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M01 Blockquote',
  component: require('./M01Blockquote'),
  argTypes: {
    variant: {
      control: { type: 'select', options: ['royalAnnouncement', 'testimonial'] },
      description: 'Specifies the variant of a blockquote.',
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies an icon. Leave blank for no icon',
    },
    size: {
      control: { type: 'select', options: ['none', 'small'] },
      description: 'Toggle small size on or off.',
    },
    quote: {
      control: { type: 'text' },
      description: 'Specifies the quotes text label',
    },
    author: {
      control: {
        type: 'object',
      },
      description: 'Uses prefix, name and role props',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders a blockquote with either an icon, quote, author or both. Several themes, variants and sizes are available.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs><div style="
  text-align: center
  ">
  {{> m01-blockquote @root }}</div></hbs>`,
});

export const Royal = () => ({
  template: `<hbs><div style="
  text-align: center
  ">
  {{> m01-blockquote @root }}</div></hbs>`,
});

export const Testimonial = () => ({
  template: `<hbs><div style="
  text-align: center;
  ">
  <style>.m-blockquote.-testimonial {
  visibility: visible;
  background-color: var(--color-nic-navy)
  }</style>
  {{> m01-blockquote @root }}</div></hbs>`,
});

Default.args = M01DataExample;
Royal.args = M01DataRoyal;
Testimonial.args = M01DataTestimonial;
