var webpack = require('webpack');
var path = require('path');
var combineLoaders = require('webpack-combine-loaders');

module.exports = {
  context: __dirname,
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'script.js'
  },

  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".json", '.tsx']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.tsx$/,
      loader: 'babel-loader!ts-loader'
    }, {
      test: /\.css$/,
      loader: combineLoaders([{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[local]___[hash:base64:5]'
        }
      }])
    }, {
      test: /\.html$/,
      loader: 'text-loader'
    }, {
      test: /\.(png|jpg)(\?*)?/,
      loader: 'base64-inline-loader'
    }]
  },

  devtool: 'cheap-module-eval-source-map'
};
