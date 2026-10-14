const path = require('path');
const commonConfig = require('./webpack.common.js');
const { mergeWithRules } = require('webpack-merge');

const config = {
  target: 'web',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader'],
      },
    ],
  },
  devServer: {
    watchFiles: ['./src/html/*.html'],
    allowedHosts: 'all',
    static: path.join(__dirname, 'dist'),
    hot: true,
    port: 3001,
    open: false,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    filename: '[name].bundled.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
};

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'prepend',
    },
  },
})(commonConfig, config);
