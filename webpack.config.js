const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/bigDecimal.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bigDecimal.js',
    library: 'BigDecimal',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            'env'
          ]
        }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};