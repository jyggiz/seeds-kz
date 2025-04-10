import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import O71RegionSliderNavigation from './O71RegionSliderNavigation.lazy';
import { O71RegionSliderNavigationProps } from './O71RegionSliderNavigation.types';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O71Data from './data/default.yaml';

export default {
  component: O71RegionSliderNavigation,
  title: `NEOM/organism/O71RegionSliderNavigation`,
  argTypes: {
    variant: {
      control: {
        type: 'text',
      },
    },
    images__region__src: {
      control: {
        type: 'text',
      },
    },
    images__region__alt: {
      control: {
        type: 'text',
      },
    },
    images__region__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    images__region__sources__0__media: {
      control: {
        type: 'text',
      },
    },
    items__0__images__region__src: {
      control: {
        type: 'text',
      },
    },
    items__0__images__region__alt: {
      control: {
        type: 'text',
      },
    },
    items__0__images__region__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    items__0__images__region__sources__0__media: {
      control: {
        type: 'text',
      },
    },
    items__1__images__region__src: {
      control: {
        type: 'text',
      },
    },
    items__1__images__region__alt: {
      control: {
        type: 'text',
      },
    },
    items__1__images__region__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    items__1__images__region__sources__0__media: {
      control: {
        type: 'text',
      },
    },
    items__2__images__region__src: {
      control: {
        type: 'text',
      },
    },
    items__2__images__region__alt: {
      control: {
        type: 'text',
      },
    },
    items__2__images__region__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    items__2__images__region__sources__0__media: {
      control: {
        type: 'text',
      },
    },
    items__3__images__region__src: {
      control: {
        type: 'text',
      },
    },
    items__3__images__region__alt: {
      control: {
        type: 'text',
      },
    },
    items__3__images__region__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    items__3__images__region__sources__0__media: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
    <div style="background-color: var(--color-black);
    height: 100vh;">
       {{> o71-region-slider-navigation }}
    </div>
  </hbs>`,
});

export const Default = withMappedProps<O71RegionSliderNavigationProps>(Template);

Default.args = flattenProps(O71Data);
