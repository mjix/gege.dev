var fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

var _ENV_ = (process.env.NODE_ENV || 'dev').trim();

var config = {
  outputPath: '',
  sourcePath: '../source/'
};

var publicPath = './',
  cssPath = '../../',
  distFile = config.outputPath+'index.html';

/**********************end replace html**************************/

var _plugins = [
  new webpack.optimize.UglifyJsPlugin(),
  new CleanWebpackPlugin(['static/images/__*', 'static/css/__*', 'static/js/__*'], {
    allowExternal:true
  }),
  new ExtractTextPlugin(config.outputPath+'static/css/__[name]-[hash:7].css'),
  new HtmlWebpackPlugin({  // Also generate a test.html
    filename: distFile,
    template: config.sourcePath+'index.html',
    inject:'body',
    chunks: ['gegedev']
  })
];

if(_ENV_ == 'hotdev'){
  _plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  entry: {
    'gegedev': config.sourcePath+'static/js/main.js'
  },
  output: {
    filename: 'static/js/__[name]-[hash:7].bundle.js',
    path: path.resolve(__dirname, './'),
    publicPath: publicPath,
    libraryTarget: "umd",
    library:     "gegedev",
    umdNamedDefine: true
  },
  resolve: {
    alias: {}
  },
  plugins: _plugins,
  externals: {},
  module: {
    rules: [{
      test: /\.(jpg|png)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: (file)=>{
            // if(_ENV_=='production'){
            //   return '[path]__[name]-[hash:base64:7].[ext]';
            // }
            return '__[name]-[hash:base64:7].[ext]';
          },
          outputPath: config.outputPath+'static/images/'
        }
      }
    },{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            url: true,
            minimize: true,
            sourceMap: true
          }
        }],
        publicPath: cssPath
      })
    },{
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
          attrs: ['img:src', 'div:data-src', 'div:data-src2']
        }
      }
    }]
  },
  devServer: {
    port: 9987,
    host: '0.0.0.0',
    public: "127.0.0.1:9987",
    historyApiFallback: true,
    inline: true,
    noInfo: false,
    stats: 'minimal',
    contentBase: path.join(__dirname, config.outputPath),
    watchContentBase: true,
    publicPath: "/",
    hot: true
  }
};



