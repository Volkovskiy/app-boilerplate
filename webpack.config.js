const webpack = require('webpack'),
	babel = require('babel-loader');
	isDevelopment = require('./gulpfile');

module.exports = {
	entry: {
		main: './src/js/main.js'
	},
	output: {
		filename: '[name].js'
	},
	module: {
		loaders: [{
			loader: 'babel'
		}]
	},
	resolve: {
		extensions: ['', '.js']
	},
	devtool: isDevelopment ? 'source-map' : null,
	plugins: isDevelopment ? null  : [new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings:     false,
				drop_console: true,
				unsafe:       true
			}
		})]
};
