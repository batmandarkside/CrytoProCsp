/* eslint-disable global-require */
const webpack = require('webpack');
const path = require('path');

const appPath = path.join(process.cwd(), 'src');
const processEnv = process.env.NODE_ENV;


const aliases = {
  root: process.cwd()
};

process.noDeprecation = true;

module.exports = {
  target : 'web',
  devtool: '#hidden-source-map',
  entry  : [
    path.join(appPath, 'index.js')
  ],
  output : {
    path         : path.join(process.cwd(), 'dist'),
    publicPath   : path.join('/'),
    filename     : '[name].js'
  },
  resolve: {
    extensions: ['.js'],
    modules   : [
      './src',
      './node_modules/'
    ].map(p => path.resolve(p)),
    alias     : aliases
  },
  module : {
    noParse: /\.DS_Store/,
    rules  : [
      {
        test   : /\.js$/,
        loader : 'babel-loader',
        exclude: /(node_modules)/,
        query  : {
          plugins: [
            'add-module-exports',
            'transform-async-to-generator'
          ],
          env           : {
            modules: false
          },
          presets       : [
            'es2015',
            'stage-0',
            'flow'
          ],
          cacheDirectory: false
        }
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: 3,
      children : true,
      async    : true
    }),

    new webpack.optimize.UglifyJsPlugin({
      exclude  : /\.html/i,
      minimize : true,
      sourceMap: false,
      compress : {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      BROWSER               : JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify(processEnv),
      BROWSER_SUPPORTS_HTML5: true
    })
  ]
};
