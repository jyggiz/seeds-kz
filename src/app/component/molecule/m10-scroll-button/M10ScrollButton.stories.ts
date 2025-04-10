export default {
  title: 'NEOM/molecule/M10 Scroll Button',
  component: require('./M10ScrollButton'),
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Renders only one icon to make component scrollable',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
    <style>
      :root {
        --color-storybook-background: var(--color-tonomus-purple-200);
      }

      .container {
        height: 100vh;
        width: 100vw;
        border: 1px solid white;
        position: relative;
        text-align: center;
      }

      .target {
        background-color: var(--color-tonomus-violet-100);
      }

      .heading {
        display: block;
        font-size: 40px;
        color: white;
        max-width: 600px;
        margin: 100px auto;
      }
    </style>
    <div data-component="c01-dummy-container"class="container">
      {{> m10-scroll-button }}
      <span class="heading">
        Click on the button with the mouse icon and the application should scroll to the NEXT BLOCK COMPONENT
      </span>
    </div>

    <div class="container target" data-component="c02-dummy-target">
      <span class="heading">NEXT BLOCK COMPONENT</span>
    </div>
  </hbs>`,
});
