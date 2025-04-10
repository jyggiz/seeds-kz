const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

exports.config =
  ({ config, isDevelopment, buildType, isPartials }) =>
  (webpackConfig) => {
    let optimization = {
      chunkIds: 'named',
      concatenateModules: true,
      minimize: buildType === config.buildTypes.PRODUCTION,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          terserOptions: {},
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            processorOptions: {
              parser: require.resolve('postcss-safe-parser'),
              map:
                buildType === config.buildTypes.DEVELOPMENT
                  ? {
                      // `inline: false` forces the sourcemap to be output into a
                      // separate file
                      inline: false,
                      // `annotation: true` appends the sourceMappingURL to the end of
                      // the css file, helping the browser find the sourcemap
                      annotation: true,
                    }
                  : false,
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          criticalCss: {
            name: 'critical-css',
            type: 'css/mini-extract',
            test: /(c12-hero-slider|o60-hero-content|a03-heading.scss|a04-eyebrow|m02-button|a02-icon|a07-label|a08-page-indicators|m34-component-background|a01-image|a19-video).*\.scss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    if (config.dist.enableImageOptimization) {
      optimization.minimizer.push(
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: [
                config.dist.enablePNGQuant
                  ? ['pngquant', { quality: [0.6, 0.7] }]
                  : ['optipng', { optimizationLevel: 3 }],
                [
                  'mozjpeg',
                  {
                    quality: 85,
                    progressive: true,
                  },
                ],
              ],
            },
          },
        }),
      );
    }

    if (isDevelopment || isPartials) {
      optimization = {
        emitOnErrors: false,
      };
    }

    return {
      ...webpackConfig,
      optimization,
    };
  };
