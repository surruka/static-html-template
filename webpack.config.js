const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.min.js',
    path: `${__dirname}/dist`,
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new MiniCSSExtractPlugin(),
    new FaviconsWebpackPlugin({
      logo: './src/img/favicon.png',
      cache: true,
      publicPath: 'img/',
      outputPath: '/img/favicon',
      prefix: 'favicon/',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Extract CSS from JS to place in other file
          MiniCSSExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        // Transforms files into base64 URIs
        test: /\.(eot|woff|ttf)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            },
          },
          {
            // Plugin and Loader for webpack to optimize (compress) all images using imagemin
            loader: ImageminPlugin.loader,
            options: {
              bail: false,
              cache: true,
              imageminOptions: {
                plugins: [
                  'jpegtran',
                  ['optipng', { optimizationLevel: 5 }],
                  'svgo'],
              },
            },
          },
        ],
      },
      {
        // Every local <img src="image.png"> turn to (require('./image.png'))
        test: /\.(html)$/,
        loader: 'html-loader',
      },
      {
        // Transpile Javascript code
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
    ],
  },
};
