
const webpack = require('webpack')
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')


module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['lodash'],
          presets: ['es2015'],
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { strictMath: true, noIeCompat: true } },
        ],
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      minimize: true,
      sourceMap: true,
    }),
    */
  ],
}
