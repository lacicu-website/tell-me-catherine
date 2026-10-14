const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { globSync } = require('glob');
const srcDir = `${process.cwd()}/src/html`;

// entryのhtmlファイルは複数の場合があるので、全て取得してHtmlWebpackPluginに渡す
const pages = globSync('**/*.html', {
  cwd: srcDir,
  ignore: '**/_*.html',
}).map((fileName) => {
  const page = new HtmlWebpackPlugin({
    filename: fileName,
    template: `./src/html/${fileName}`,
    minify: false,
  });
  return page;
});

const cssLoader = (importLoaders) => ({
  loader: 'css-loader',
  options: {
    url: true,
    importLoaders,
  },
});

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: { plugins: [require('postcss-preset-env')] },
  },
};

// style-loader / MiniCssExtractPlugin.loader は dev / prod 側で先頭に追加する
const config = {
  entry: {
    scripts: './src/scripts/app.js',
  },
  plugins: [
    new ESLintPlugin({
      configType: 'flat',
    }),
    ...pages,
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [cssLoader(1), postcssLoader],
      },
      {
        test: /\.scss$/i,
        use: [
          cssLoader(2),
          postcssLoader,
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                // referenceに合わせて@importとグローバル関数を使うため、非推奨警告を抑制
                silenceDeprecations: ['import', 'global-builtin'],
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: false,
        },
      },
      {
        test: /\.(png|gif|svg|jpe?g|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff2|woff|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    // src/images 以下のディレクトリ構成を保ったまま出力する
    assetModuleFilename: (pathData) => {
      const filepath = path.dirname(pathData.filename).split('/').slice(1).join('/');
      return `${filepath}/[name][ext]`;
    },
  },
};

module.exports = config;
