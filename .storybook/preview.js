import '../src/app/style/main.scss';
import { lazyLoadComponents } from '../src/app/lazyLoadComponents';
import { elementLoader, awaitLoad } from './helpers/awaitLoad';
import timeoutPromise from '../src/app/util/timeout-promise';
import registerPartialMap from '../src/app/registerPartialMap';
import { getModuleContext } from 'muban-core/lib/utils/webpackUtils';
import registerComponent from 'muban-core/lib/dev-utils/registerComponent';
const partialsContext = require.context('../src/app/component/', true, /\.hbs$/);
import Handlebars from 'handlebars/runtime';

// This file controls the way stories are rendered and global decorators and parameters.
export const parameters = {
  docs: {
    iframeHeight: 200,
  },
  storySort: {
    method: 'alphabetical',
    includeName: true,
  },
};

// This allows us to control which templates Handlebars will be able to dynamically render.
// See registerPartialMap for predicate.
const loadDynamicPartials = (partialsContext, options) => {
  getModuleContext(partialsContext, (_, key, module) => {
    registerComponent(key, module, options);
  });
};

loadDynamicPartials(partialsContext, { registerPartialMap, Handlebars });

// GLOBAL TYPES

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'neom',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['neom', 'oxagon'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};

// DECORATORS

const withLazyLoading = (story, context) => {
  const rootElement = document.getElementById('root');
  const rawTemplate = story().template.raw;

  const extractedComponentId = rawTemplate.match(/{{>\s*([\w-]+)/)[1];
  // To lazy load a component we need that component's element to be present on the page.
  // As such, we need to wait for story(), which is the compiled handlebars template function, to
  // execute and render the element in html.
  const loadElementPromise = awaitLoad(elementLoader(extractedComponentId));

  timeoutPromise(
    1000,
    loadElementPromise,
    `Timeout while trying to get element node for component ${extractedComponentId}`,
  )
    .then(() => lazyLoadComponents(rootElement))
    .catch((err) => console.log(err));

  return story();
};

const setTheme = (themeName) => {
  document.querySelector('html').dataset.theme = themeName;
};

const withThemeProvider = (story, context) => {
  setTheme(context.globals.theme);
  return story();
};
export const decorators = [withThemeProvider, withLazyLoading];
