import { Meta, StoryContext } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import O95DynamicCarouselData from './data/default.yaml';
import { O95DynamicCarouselProps } from './O95DynamicCarousel.types';
import { cleanElement, getComponentForElement } from 'muban-core';
import O95DynamicCarousel from './O95DynamicCarousel';
import { StoryFnMubanReturnType } from '@muban/storybook/dist/client/preview/types';
import timeoutPromise from 'app/util/timeout-promise';

const flattenedData = flattenProps(O95DynamicCarouselData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O95DynamicCarousel`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
  decorators: [
    (story: () => StoryFnMubanReturnType, context: StoryContext) => {
      const element = document.querySelector(
        `[data-component="${O95DynamicCarousel.displayName}"]`,
      ) as HTMLElement;

      if (element) {
        // clean existing element to make sure we get a fresh instance when story is rerendered
        cleanElement(element);
      }
      // o95 instance will become available only after the template has been compiled by handlebars
      // and rendered by storybook
      timeoutPromise(
        1000,
        loadAsync(componentLoader(O95DynamicCarousel.displayName)),
        'could not get component in o95 story',
      ).then((o95) => {
        (o95 as O95DynamicCarousel).initSlider({
          loop: false,
          direction: 'horizontal',
          slidesPerView: 1.8,
          spaceBetween: 30,
          width: 800,
        });
      });

      return story();
    },
  ],
} as Meta;

const isLoaded: <T>(loader: () => any) => Promise<T> = (loader) => {
  return new Promise((resolve, reject) => {
    const loadResponse = loader();

    if (loadResponse) {
      resolve(loadResponse);
    } else {
      reject();
    }
  });
};

const loadAsync = <T>(loader: () => any): Promise<T> => {
  return new Promise(async (resolve) => {
    const load = () => {
      isLoaded<T>(loader)
        .then((loadResponse) => resolve(loadResponse))
        .catch(() => setTimeout(load, 0));
    };

    load();
  });
};

const componentLoader = (elementName: string) => () => {
  const element = document.querySelector(`[data-component="${elementName}"]`) as HTMLElement;
  const component = getComponentForElement(element);

  return component;
};

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs><div style="--card-size: 400px;">{{> o95-dynamic-carousel }}</div></hbs>`,
  };
};

export const Default = withMappedProps<O95DynamicCarouselProps>(Template);

Default.args = flattenedData;
