import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import O64HotspotMap from './O64HotspotMap.lazy';
import O64Data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { O64HotspotMapProps } from './O64HotspotMap.types';

export default {
  component: O64HotspotMap,
  title: `NEOM/organism/O64HotspotMap`,
  argTypes: {
    static: {
      control: {
        type: 'boolean',
      },
    },
    mapBackground__src: {
      control: {
        type: 'text',
      },
    },
    mapBackground__alt: {
      control: {
        type: 'text',
      },
    },
    startPosition__x: {
      control: {
        type: 'number',
      },
    },
    startPosition__y: {
      control: {
        type: 'number',
      },
    },
    overlayBackgrounds__0__src: {
      control: {
        type: 'text',
      },
    },
    overlayBackgrounds__1__src: {
      control: {
        type: 'text',
      },
    },
    overlayBackgrounds__2__src: {
      control: {
        type: 'text',
      },
    },
    items__0__active: {
      control: {
        type: 'boolean',
      },
    },
    items__0__content__heading__text: {
      control: {
        type: 'text',
      },
    },
    items__0__content__copy: {
      control: {
        type: 'text',
      },
    },
    items__0__content__buttons__0__label: {
      control: {
        type: 'text',
      },
    },
    items__0__content__buttons__0__href: {
      control: {
        type: 'text',
      },
    },
    items__0__content__image__alt: {
      control: {
        type: 'text',
      },
    },
    items__0__content__image__src: {
      control: {
        type: 'text',
      },
    },
    items__0__offset__y: {
      control: {
        type: 'number',
      },
    },
    items__0__offset__x: {
      control: {
        type: 'number',
      },
    },
    items__1__active: {
      control: {
        type: 'boolean',
      },
    },
    items__1__content__heading__text: {
      control: {
        type: 'text',
      },
    },
    items__1__content__copy: {
      control: {
        type: 'text',
      },
    },
    items__1__content__buttons__0__label: {
      control: {
        type: 'text',
      },
    },
    items__1__content__buttons__0__href: {
      control: {
        type: 'text',
      },
    },
    items__1__content__image__alt: {
      control: {
        type: 'text',
      },
    },
    items__1__content__image__src: {
      control: {
        type: 'text',
      },
    },
    items__1__offset__y: {
      control: {
        type: 'number',
      },
    },
    items__1__offset__x: {
      control: {
        type: 'number',
      },
    },
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
        {{> o64-hotspot-map }}
        </hbs>`,
});

export const Default = withMappedProps<O64HotspotMapProps>(Template);

for (let i = 2; i < 10; i++) {
  delete O64Data.items[i];
}

Default.args = flattenProps(O64Data);
