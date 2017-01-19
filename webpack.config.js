const webpack = require('webpack'),
	babel = require('babel-loader');
let	isDevelopment = require('./gulpfile');

module.exports = {
	entry: {
		main: './src/js/main.js'
	},
	output: {
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel'
		}]
	},

	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['node_modules']
	},
	devtool: isDevelopment ? 'eval-source-map' : null,
	plugins: isDevelopment ? null  : [new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings:     false,
				drop_console: true,
				unsafe:       true
			}
		})]
};
