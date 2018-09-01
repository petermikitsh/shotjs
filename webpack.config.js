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
      './example/index'
    ],
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
    output: {
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({template: 'example/index.html'}),
      new OpenBrowserPlugin({url: `http://${HOST}:${PORT}`})
    ]
  };
};
