/**
 * Generation the production pages from the compiled partials and json files
 */
const fs = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const Handlebars = require('handlebars');
// eslint-disable-next-line import/no-extraneous-dependencies
const beautifyHtml = require('js-beautify').html;
const importFresh = require('import-fresh');

const config = require('../config/config');
const { addToIndex, renderIndex, startNewIndex } = require('./util/index-page');
const getPages = require('./util/getPages');
const Queue = require('queue-promise');

const templatePath = path.resolve(__dirname, '../templates');

module.exports = function (options) {
  // load partials
  const partialsPath = path.join(config.buildPath, 'asset/partials.js');
  if (!fs.existsSync(partialsPath)) {
    throw new Error('Partials file not present, run `yarn build partials` first.');
  }
  // eslint-disable-next-line import/no-unresolved
  const { indexTemplate, appTemplate } = importFresh(partialsPath);

  // compile normal and standalone page templates
  const htmlTemplate = Handlebars.compile(
    fs.readFileSync(path.join(templatePath, 'build-html-template.hbs'), 'utf-8'),
  );
  const htmlTemplateStandalone = config.standaloneOutput
    ? Handlebars.compile(
        fs.readFileSync(path.join(templatePath, 'build-html-template-standalone.hbs'), 'utf-8'),
      )
    : null;

  // prepare standalone output
  const standalonePath = path.resolve(config.buildPath, 'standalone');
  if (config.standaloneOutput) {
    if (!fs.existsSync(standalonePath)) {
      fs.mkdirSync(standalonePath);
    }
  }

  console.log();
  console.log();

  startNewIndex();

  return getPages().then(
    (pages) =>
      new Promise((resolve) => {
        const queue = new Queue({
          concurrent: 10,
        });
        pages.map(({ page, file, data }) => {
          addToIndex({
            page,
            data,
          });

          // page content
          const content = appTemplate(data);

          // render normal page
          queue.enqueue(() =>
            renderPage(htmlTemplate, content, page, config.buildPath, data)
              .then(() => {
                // render standalone page
                if (config.standaloneOutput) {
                  return renderPage(htmlTemplateStandalone, content, page, standalonePath, data);
                }
              })
              .then(() => console.log(`Generating... ${page}.html`)),
          );
        });

        queue.on('start', () => console.log('Start promise queue'));
        queue.on('end', () => {
          renderIndex(indexTemplate, htmlTemplate);

          if (options && options.cleanPartials) {
            // cleanup, doesn't belong in the build folder
            fs.unlinkSync(partialsPath);
          }

          resolve();
        });
      }),
  );
};

/**
 * Render body content into a full html page
 * @param template
 * @param content
 * @param page
 * @param outputPath
 * @returns {Promise}
 */
function renderPage(template, content, page, outputPath, data) {
  // render full html page
  let templateStandaloneResult = template({
    content,
    page,
    data,
    publicPath: config.dist.publicPath,
  });

  const commonCss = fs.readFileSync(`${outputPath}/asset/common.css`, 'utf-8');
  const criticalCss = fs.readFileSync(`${outputPath}/asset/critical-css.css`, 'utf-8');

  templateStandaloneResult = templateStandaloneResult
    .replace(
      '<style data-common-inlined type="text/css"></style>',
      `<style type="text/css">${commonCss}</style>`,
    )
    .replace(
      '<style data-critical-css-inlined type="text/css"></style>',
      `<style type="text/css">${criticalCss}</style>`,
    );

  // make it pretty
  const html = beautifyHtml(templateStandaloneResult, { indent_size: 2 });

  const isKz = page.includes('kz')
  const pageName = page.replace(/-kz/g, "")
  // output to disk
  return new Promise((resolve, reject) => {
    const finalOutputPath = isKz ? path.join(outputPath, 'kz') : outputPath;

    fs.mkdirSync(finalOutputPath, { recursive: true });

    const fullPath = path.join(finalOutputPath, `${pageName}.html`);

    fs.writeFile(fullPath, html, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(fullPath);
      }
    });
  });
}
