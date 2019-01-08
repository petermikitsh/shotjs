const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const HOST = '0.0.0.0';
const PORT = 4000;

module.exports = function () {
  return {
    devServer: {
      contentBase: path.join(__dirname, './tmp'),
      disableHostCheck: true,
      historyApiFallback: true,
      host: HOST,
      port: PORT,
      publicPath: '/',
      stats: 'minimal'
    },
    devtool: 'inline-source-map',
    entry: [
      './docs/index'
    ],
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'docs'),
            path.resolve(__dirname, 'src'),
          ],
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, 'node_modules/material-react-components')
          ],
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    output: {
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({template: 'docs/index.html'}),
      new OpenBrowserPlugin({url: `http://${HOST}:${PORT}`})
    ]
  };
};
