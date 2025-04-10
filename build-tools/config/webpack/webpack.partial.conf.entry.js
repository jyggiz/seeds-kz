const path = require('path');

exports.config =
  ({ config, isDevelopment, isPartials }) =>
  (webpackConfig) => {
    const entry = {};

    if (isPartials) {
      entry.partials = ['./src/app/partials.js'];
    } else if (isDevelopment) {
      entry.main = [
        './src/app/polyfills.js',
        './src/app/bootstrap.dev.ts',
        './src/app/style/aem-editor.scss',
        './src/app/style/main.scss',
        './src/app/style/fonts/fonts-default.scss',
      ];
    } else {
      entry.bundle = [
        'modernizr',
        './src/app/component/layout/app/app.hbs',
        './src/app/polyfills.js',
        './src/app/bootstrap.dist.ts',
      ];
      entry.common = ['./src/app/style/main.scss', './src/app/component/layout/app/app.scss'];

      entry.fontsLatin = ['./src/app/style/fonts/fonts-latin.scss'];
      entry.fontsDefault = ['./src/app/style/fonts/fonts-default.scss'];

      entry.preview = ['./src/app/component/layout/index/index.hbs'];
      entry.editorStyles = ['./src/app/style/aem-editor.scss'];
    }

    return {
      ...webpackConfig,
      entry,
    };
  };
