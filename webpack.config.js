/* eslint-disable no-undef */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PugLintPlugin = require('puglint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const options = {
  context: 'src',
  files: '**/*.pug',
  config: Object.assign({ emitError: true }, require('puglint-webpack-plugin')),
};

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
  },

  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[hash].js',
  },
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    port: 3002,
    watchFiles: ['./src/*.pug', './**/*.scss'],
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Настройки автопрефиксера
                      overrideBrowserslist: ['last 2 versions'],
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.pug$/i,
        use: 'pug-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: 'svg-sprite-loader',
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
    }),
    new ESLintPlugin({
      fix: true,
    }),
    new PugLintPlugin(options),
    new CopyWebpackPlugin({
      patterns: [{ from: './src/Assets/images', to: 'images' }],
    }),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        libs: {
          name: 'libs',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  performance: {
    hints: false, // или 'error' или false
  },
};
