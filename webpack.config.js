const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
  return {
    devServer: {
      contentBase: path.join(__dirname, './tmp'),
      disableHostCheck: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 4000,
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
      new HtmlWebpackPlugin({
        template: 'example/index.html'
      })
    ]
  };
};
