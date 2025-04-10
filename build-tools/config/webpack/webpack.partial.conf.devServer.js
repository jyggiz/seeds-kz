const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '../../../');

exports.config =
  ({ config }) =>
  (webpackConfig) => ({
    ...webpackConfig,
    devServer: {
      client: {
        logging: 'info',
        overlay: {
          warnings: false,
          errors: true,
        },
      },
      hot: 'only',
      open: false,
      devMiddleware: { publicPath: '/' },
      static: {
        directory: config.staticPath,
      },
      allowedHosts: 'all',
      host: process.env.HOST || '0.0.0.0',
      port: config.devServer.port,
      proxy: config.devServer.proxyTable,
      setupMiddlewares(middlewares, devServer) {
        // render basic default index.html for all html files (path will be picked by JS)
        devServer.app.use((req, res, next) => {
          if (req.path.includes('.html')) {
            // ignore any url that would go trough the proxy table.
            if (
              config.devServer.proxyTable &&
              Object.keys(config.devServer.proxyTable).some((p) => req.path.indexOf(p) === 0)
            ) {
              return next();
            }
            res.send(
              fs.readFileSync(
                path.resolve(config.projectRoot, 'build-tools/templates/devserver-index.html'),
                'utf-8',
              ),
            );
          } else {
            next();
          }
        });

        // also render index.html on /
        devServer.app.get('/', function (req, res) {
          res.send(
            fs.readFileSync(
              path.resolve(config.projectRoot, 'build-tools/templates/devserver-index.html'),
              'utf-8',
            ),
          );
        });

        return middlewares;
      },
      https: config.devServer.useHttps,
    },
  });
