const path = require('path');
const webpack = require('webpack');

const rootFolder = path.resolve(__dirname, '../../');

module.exports = {
  context: path.resolve(rootFolder, './src'),
  entry: {
    'async-script-loader': './index.js',
  },
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    })
  ],
  output: {
    path: path.resolve(rootFolder, './build'),
    filename: '[name].js',
  },
};
