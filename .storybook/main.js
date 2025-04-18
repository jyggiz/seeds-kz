const buildConfig = require('../build-tools/config/config');
const { getStyleRules } = require('../build-tools/config/webpack/webpack.partial.conf.module');
const { getSvgRules } = require('../build-tools/config/webpack/webpack.partial.conf.module');
const { getDataRules } = require('../build-tools/config/webpack/webpack.partial.conf.module');
const { getHbsRules } = require('../build-tools/config/webpack/webpack.partial.conf.module');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: {
    previewCsfV3: true,
  },
  stories: ['../src/app/component/**/*.stories.*'],
  staticDirs: ['../src/static'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need

    const buildType = configType.toLowerCase();
    const isDevelopment = buildType === buildConfig.buildTypes.DEVELOPMENT;

    const mubanConfigOptions = {
      config: buildConfig,
      isDevelopment,
      buildType,
      isPartials: false,
      isCode: false,
    };

    // remove this rule that deals with svgs
    config.module.rules = config.module.rules.filter((rule) => !String(rule.test).includes('svg'));
    // add the rule back without the svg in it, jep, a bit hacky
    config.module.rules.push({
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
      type: 'asset/resource',
    });

    config.module.rules.push(
      ...getHbsRules(mubanConfigOptions),
      ...getDataRules(mubanConfigOptions),
      ...getStyleRules({ ...mubanConfigOptions, isDevelopment: true, buildType: 'development' }),
      ...getSvgRules(mubanConfigOptions),
    );

    // web gl rules
    config.module.rules.push({
      test: /\.glsl$/,
      loader: 'webpack-glsl-loader',
    });

    const mubanResolve =
      require('../build-tools/config/webpack/webpack.partial.conf.resolve').config({
        config: buildConfig,
        isDevelopment,
        buildType,
      })({});

    config.resolve = {
      ...config.resolve,
      ...mubanResolve.resolve,
      extensions: [...mubanResolve.resolve.extensions, ...config.resolve.extensions],
      alias: { ...mubanResolve.resolve.alias, ...config.resolve.alias },
    };

    // Return the altered config
    return config;
  },
};
