const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: false,
  entry: {
    index: './src/index.js',
    'index.min': './src/index.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  },
  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: '[name].js',
    library: 'ShotJS',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  plugins: [
    new CompressionPlugin({
      include: /\.min\.js$/
    })
  ]
};
