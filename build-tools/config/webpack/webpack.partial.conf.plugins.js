const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RemovePlugin = require('remove-files-webpack-plugin');

const { cleanupTemplate } = require('./webpack.helpers');

exports.config =
  ({ config, isDevelopment, buildType, isPartials }) =>
  (webpackConfig) => {
    if (isPartials) {
      // partials don't need plugins
      return webpackConfig;
    }

    const plugins = [
      new webpack.DefinePlugin({
        'process.env': config.env[buildType],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../../../node_modules/pdfjs-dist/build/pdf.worker.js'),
            to: path.join(
              config.buildPath,
              isDevelopment ? '/pdf.worker.js' : '/asset/pdf.worker.[contenthash].js',
            ),
          },
        ],
      }),
    ];

    if (isDevelopment) {
      /*
       * ------------------------------------------------
       * Development-only plugins
       * ------------------------------------------------
       */
      plugins.push(
        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),
      );
    } else {
      /*
       * ------------------------------------------------
       * Production-only plugins
       * ------------------------------------------------
       */
      plugins.push(
        new WebpackAssetsManifest({
          output: path.resolve(config.distPath, 'site/asset/asset-manifest.json'),
          customize(entry) {
            if (entry.key.includes('asset/pdf.worker')) {
              return entry;
            }

            return false;
          },
        }),
        new RemovePlugin({
          // After compilation permanently remove empty JS files created from CSS chunks.
          after: {
            root: config.distPath,
            test: [
              {
                folder: './site/asset',
                method: (absoluteItemPath) => {
                  return new RegExp(/(editor|common).*\.js$/, 'i').test(absoluteItemPath);
                },
              },
            ],
          },
        }),

        new MiniCssExtractPlugin({
          filename: 'asset/[name].css',
          chunkFilename: 'asset/[id].[contenthash:7].css',
        }),

        new CopyWebpackPlugin({
          patterns: [
            {
              // copy files to public root (not versioned)
              context: config.staticPath,
              from: '**/*',
              to: config.buildPath,
            },
            {
              // copy over hbs templates and remove muban-specific imports and partial paths
              context: path.resolve(config.projectRoot, 'src/app/component'),
              from: '**/*.hbs',
              to: path.resolve(config.distPath, 'templates') + '/[path]/[name].hbs',
              toType: 'template',
              transform(content) {
                return cleanupTemplate(content.toString('utf8'));
              },
            },
            // {
            //   // add support for TWIG/HBS drupal integration, generates a twig file that includes a hbs partial
            //
            //   context: path.resolve(config.projectRoot, 'src/app/component'),
            //   from: '**/*.hbs',
            //   to: path.resolve(config.distPath, 'templates') + '/[path]/[name].html.twig',
            //   toType: 'template',
            //   transform (content, path) {
            //     return `{{ handlebars('${path.split(/[/\\]/gi).pop()}', data) }}`;
            //   },
            // },
            // CONVERT HBS TEMPLATES
            config.convertTemplates && config.convertTemplates.convertTo
              ? {
                  // convert hbs to htl templates
                  context: path.resolve(config.projectRoot, 'src/app/component'),
                  from: '**/*.hbs',
                  to:
                    path.resolve(config.distPath, 'templates') +
                    '/[path]/[name].' +
                    config.convertTemplates.extension,
                  toType: 'template',
                  transform(content, path) {
                    // convert to target template
                    try {
                      return convert(
                        cleanupTemplate(content.toString('utf8')),
                        config.convertTemplates.convertTo,
                      );
                    } catch (e) {
                      console.log(`failed converting "${path}"`);
                      console.log(e);
                      throw e;
                    }
                  },
                }
              : null,
            {
              // copy over component json
              context: path.resolve(config.projectRoot, 'src/app/component'),
              from: '**/*.{yaml,json}',
              to: path.resolve(config.distPath, 'templates'),
            },
            {
              // copy over data json
              context: path.resolve(config.projectRoot, 'src/data'),
              from: '**/*.{yaml,json}',
              to: path.resolve(config.distPath, 'data'),
            },
            {
              // copy over readme
              context: path.resolve(config.projectRoot, 'docs'),
              from: '12-dist-implementation-guide.md',
              to: path.resolve(config.distPath),
            },
          ].filter((_) => _),
        }),
      );

      // These are not on for a development build
      if (buildType === config.buildTypes.PRODUCTION) {
        plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true,
            statsFilename: path.resolve(config.distPath, 'bundlesize-profile.json'),
          }),
        );
      }
    }

    return {
      ...webpackConfig,
      plugins,
    };
  };
