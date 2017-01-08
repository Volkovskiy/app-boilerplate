const webpack = require('webpack'),
	babel = require('babel-loader');
	isDevelopment = require('./gulpfile');

module.exports = {
	output: {
		filename: 'common.js'
	},
	module: {
		loaders: [{
			loader: 'babel',
			query: {
				presets: ['es2015']
			}
		}]
	},
	resolve: {
		extensions: ['', '.js']
	},
	devtool: isDevelopment ? 'source-map' : null,
	plugins: [      new webpack.optimize.UglifyJsPlugin({
			compress: {
			warnings:     false,
			drop_console: true,
			unsafe:       true
		}
	})]
};
