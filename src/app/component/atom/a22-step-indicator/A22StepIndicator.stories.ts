import { A22StepIndicatorProps } from './A22StepIndicator.types';

export default {
  title: 'NEOM/atom/A22 Step-indicator',
  component: require('./A22StepIndicator'),
  argTypes: {
    active: {
      control: {
        type: 'boolean',
      },
      description: 'Set page indicator to active state or not',
    },
    variant: {
      control: {
        type: 'text',
      },
      description: 'Set page indicator to a specific variant',
    },
    index: {
      control: {
        type: 'number',
      },
      description: 'Set page indicator number that is shown',
    },
    passed: {
      control: {
        type: 'boolean',
      },
      description: 'Set page indicator to passed state or not',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a step indicator component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
        {{> a22-step-indicator }}
        </hbs>`,
});

export const RegionSlider = () => ({
  template: `<hbs>
        {{> a22-step-indicator }}
        </hbs>`,
});

const defaultProps: A22StepIndicatorProps = {
  active: true,
  index: 1,
  passed: false,
};

const regionSliderProps: A22StepIndicatorProps = {
  variant: 'regionSlider',
  active: true,
  index: 1,
  passed: false,
};

Default.args = defaultProps;

RegionSlider.args = regionSliderProps;
