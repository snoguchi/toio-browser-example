'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    alias: {
      'noble-mac': 'noble'
    }
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'static' }]),
    new webpack.IgnorePlugin(/^ws$/)
  ],
  devtool: 'source-map'
};
