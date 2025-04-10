const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const jsonImporter = require('node-sass-json-importer');
const esbuild = require('esbuild');

const { getReplaceLoader, getImportLoader, getCacheLoader } = require('./webpack.helpers');

const isProd = (config, buildType) => buildType === config.buildTypes.PRODUCTION;

// /*
//  * ------------------------------------------------
//  * Handlebars
//  * ------------------------------------------------
//  */
exports.getHbsRules = ({ config, isDevelopment, buildType, isPartials, isCode }) => [
  {
    test: /\.hbs/,
    use: [
      getCacheLoader(config, buildType, isDevelopment),
      {
        loader: 'hbs-build-loader',
        options: {
          removeScript: isDevelopment ? false : isPartials,
          removeStyle: isDevelopment ? false : isPartials,
          removeTemplate: isDevelopment ? false : isCode,
          hot: isDevelopment,
        },
      },
      {
        loader: 'handlebars-loader',
        options: {
          extensions: ['.hbs', ''],
          partialDirs: [path.resolve(config.projectRoot, 'src/app/component')],
          helperDirs: [path.resolve(config.projectRoot, 'build-tools/handlebars-helpers')],
          debug: false,
          // http://handlebarsjs.com/reference.html#base-compile
          precompileOptions: {
            preventIndent: true,
          },
        },
      },
      {
        loader: 'partial-comment-loader',
      },
    ].filter(Boolean),
  },
];

// /*
//  * ------------------------------------------------
//  * JavaScript and TypeScript
//  * ------------------------------------------------
//  */
exports.getDataRules = ({ config, buildType }) => [
  {
    // Allow support for JS as data files
    test: /\.js$/,
    include: [/src[\/\\]data/, /src[\/\\]app[\/\\]component[\/\\].*data(-.*)\.js/],
    use: [getImportLoader(config, buildType)],
  },
  {
    test: /\.json$/,
    type: 'javascript/auto',
    use: [getImportLoader(config, buildType), { loader: 'json-loader' }],
  },
  {
    test: /\.yaml$/,
    use: [
      getReplaceLoader(config, buildType),
      getImportLoader(config, buildType),
      { loader: 'js-yaml-loader' },
    ],
  },
];

exports.getScriptRules = ({ config, isDevelopment, buildType }) => [
  {
    test: /\.[jt]s?$/,
    include: [/src[\/\\]app/],
    loader: 'esbuild-loader',
    options: {
      target: 'es2015',
      implementation: esbuild,
    },
  },
];
// /*
//  * ------------------------------------------------
//  * SVG
//  * ------------------------------------------------
//  */

exports.getSvgRules = () => [
  {
    test: /\.svg$/,
    oneOf: (() => {
      const svgoLoaderConfig = {
        loader: 'svgo-loader',
        options: {
          plugins: [
            { name: 'removeStyleElement' },
            { name: 'removeComments' },
            { name: 'removeDesc' },
            { name: 'removeUselessDefs' },
            { name: 'removeTitle' },
            { name: 'removeMetadata' },
            { name: 'removeComments' },
            // { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
            { name: 'cleanupIDs' },
            { name: 'prefixIds' },
            { name: 'convertColors', params: { shorthex: false } },
          ],
        },
      };

      return [
        {
          type: 'asset/source',
          use: svgoLoaderConfig,
        },
        {
          resourceQuery: /inline/,
          type: 'asset/inline',
          use: svgoLoaderConfig,
        },
      ];
    })(),
  },
];

// /*
//  * ------------------------------------------------
//  * Styling (scss and css)
//  * ------------------------------------------------
//  */
exports.getStyleRules = ({ config, isDevelopment, buildType, isPartials }) => {
  function getStyleLoaders(isScss) {
    const loaders = [
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
          importLoaders: isScss ? 2 : 0,
        },
      },
    ];

    if (isScss) {
      const extraVars = Object.keys(config.env[buildType]).reduce(
        (acc, envName) =>
          `${acc} $${envName}: "${config.env[buildType][envName].replace(/"/gi, '')}";`,
        '',
      );

      loaders.push(
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },

        {
          loader: 'sass-loader',
          options: {
            additionalData: `${extraVars}`,
            sourceMap: true,
            sassOptions: {
              importer: jsonImporter(),
            },
          },
        },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: [path.resolve(config.projectRoot, 'src/app/style/_global.scss')],
            hoistUseStatements: true,
          },
        },
      );
    }

    if (isDevelopment) {
      loaders.unshift({
        loader: 'style-loader',
      });
    } else {
      loaders.unshift({
        loader: MiniCssExtractPlugin.loader,
        options: {},
      });
    }

    const cacheLoader = getCacheLoader(config, buildType, isDevelopment);
    if (cacheLoader) {
      loaders.unshift(cacheLoader);
    }

    return loaders;
  }

  return [
    {
      test: /\.scss$/,
      use: isPartials ? [{ loader: 'null-loader' }] : getStyleLoaders(true),
    },
    {
      test: /\.css$/,
      use: getStyleLoaders(false),
    },
  ];
};

exports.config = (configOptions) => (webpackConfig) => {
  const { config, isDevelopment, buildType, isPartials } = configOptions;
  return {
    ...webpackConfig,
    module: {
      rules: [
        ...exports.getHbsRules(configOptions),
        ...exports.getDataRules(configOptions),
        ...exports.getScriptRules(configOptions),
        ...exports.getStyleRules(configOptions),
        ...exports.getSvgRules(configOptions),
        /*
         * ------------------------------------------------
         * webGL
         * ------------------------------------------------
         */
        {
          test: /\.(glsl|vs|fs|vert|frag|txt)$/,
          exclude: /node_modules/,
          loader: 'raw-loader',
        },
        /*
         * ------------------------------------------------
         * Images
         * ------------------------------------------------
         */
        {
          test: /\.(png|jpe?g|gif|webp|mp4)(\?.*)?$/,
          type: 'asset',
          generator: {
            filename: 'asset/image/[name].' + (isDevelopment ? '' : '[hash:7].') + '[ext]',
          },
        },
        /*
         * ------------------------------------------------
         * Fonts
         * ------------------------------------------------
         */
        {
          test: /\.(eot|svg|ttf|woff2?)(\?.*)?$/,
          include: path.resolve(config.projectRoot, 'src/app/font'),
          type: 'asset',
          generator: {
            filename: 'asset/font/[name][ext]',
          },
        },
        /*
         * ------------------------------------------------
         * Other
         * ------------------------------------------------
         */
        {
          test: /\.modernizrrc\.js$/,
          use: [{ loader: 'webpack-modernizr-loader' }],
        },
      ],
    },
  };
};
