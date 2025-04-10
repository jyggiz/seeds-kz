import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C96NewsletterSubscriptionData from './data/default.yaml';
import { C96NewsletterSubscriptionProps } from './C96NewsletterSubscription.types';
import C96NewsletterSubscription from './C96NewsletterSubscription.lazy';

const flattenedData = flattenProps(C96NewsletterSubscriptionData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C96NewsletterSubscription,
  title: `NEOM/block/C96NewsletterSubscription`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
      {{> c96-newsletter-subscription }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C96NewsletterSubscriptionProps>(Template);

Default.args = flattenedData;
