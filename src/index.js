const webpack = require('webpack');
const server = require('./server');
const utils = require('./utils');
const ANSIToHtml = require('ansi-to-html');

class WebpackDashboard {
  constructor(props = {}) {
    this.options = props;

    this.options.host = props.host || 'localhost';
    this.options.port = parseInt(props.port || 5060, 10);

    const packageJson = utils.getPackageJson(this.options.packageJsonPath);

    this.isServerStarted = false;
    this.clientData = {
      packageJson,
      progress: {
        percentage: 0,
        message: null,
      },
      stateData: {},
    };
  }

  doneCallBack(stats) {
    this.clientData.stateData = stats.toJson({
      color: true,
    });

    const newFormat = { newline: true, escapeXML: true, colors: true };
    const formatter = new ANSIToHtml(newFormat);
    this.clientData.stateData.warnings = this.clientData.stateData.warnings.map(
      error => formatter.toHtml(error),
    );
    if (!this.isServerStarted) {
      return;
    }

    server.io.emit('data', this.clientData);
  }

  progressCallBack(percentage, message) {
    this.clientData.progress = {
      percentage: parseInt(percentage * 100, 10),
      message,
    };

    if (!this.isServerStarted) {
      return;
    }

    server.io.emit('data', this.clientData);
  }

  startServer() {
    const { port, host } = this.options;
    const { http, io } = server;

    http.listen(port, host, () => {
      console.log(`Starting dashboard on: http://${host}:${port}`);
      this.isServerStarted = true;

      io.on('connection', socket => {
        socket.emit('data', this.clientData);
      });
    });
  }

  apply(compiler) {
    this.startServer();

    const doneCallBack = this.doneCallBack.bind(this);
    const progressCallBack = this.progressCallBack.bind(this);

    compiler.apply(new webpack.ProgressPlugin(progressCallBack));

    if (compiler.hooks) {
      compiler.hooks.done.tapAsync('my-webpack-dashboard', doneCallBack);
    } else {
      compiler.plugin('done', doneCallBack);
    }
  }
}

module.exports = WebpackDashboard;
