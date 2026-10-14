const path = require('path');
const commonConfig = require('./webpack.common.js');
const { mergeWithRules } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const miniCssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '../',
  },
};

const config = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [miniCssExtractLoader],
      },
      {
        test: /\.scss$/i,
        use: [miniCssExtractLoader],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/style.[chunkhash].css',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'scripts/[name].[chunkhash].js',
    chunkFilename: 'scripts/[name].[chunkhash].js',
    clean: true,
  },
  optimization: {
    splitChunks: { chunks: 'all', name: 'vendors' },
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'prepend',
    },
  },
})(commonConfig, config);
