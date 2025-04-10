import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import O66Data from './data/default.yaml';
import { O66IntroStepsProps } from './O66IntroSteps.types';
import O66IntroSteps from './O66IntroSteps.lazy';

export default {
  component: O66IntroSteps,
  title: `NEOM/organism/O66IntroSteps`,
  argTypes: {
    content: {
      control: {
        type: 'text',
      },
    },
    video__config__sources__0__src: {
      control: {
        type: 'text',
      },
    },
    video__config__sources__0__type: {
      control: {
        type: 'text',
      },
    },
    video__config__originalWidth: {
      control: {
        type: 'number',
      },
    },
    video__config__originalHeight: {
      control: {
        type: 'number',
      },
    },
    video__config__autoplay: {
      control: {
        type: 'boolean',
      },
    },
    video__config__muted: {
      control: {
        type: 'boolean',
      },
    },
    video__config__loop: {
      control: {
        type: 'boolean',
      },
    },
    video__config__playsinline: {
      control: {
        type: 'boolean',
      },
    },
    steps__0__image__src: {
      control: {
        type: 'text',
      },
    },
    steps__0__image__alt: {
      control: {
        type: 'text',
      },
    },
    steps__0__image__sources__src: {
      control: {
        type: 'text',
      },
    },
    steps__0__image__sources__media: {
      control: {
        type: 'text',
      },
    },
    steps__0__caption: {
      control: {
        type: 'text',
      },
    },
    steps__1__caption: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
        {{> o66-intro-steps }}
        </hbs>`,
});

export const Default = withMappedProps<O66IntroStepsProps>(Template);

Default.args = flattenProps(O66Data);
