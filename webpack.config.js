/** @format */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'), //default filename
		filename: 'main.js', //default path
	},
	module: {
		rules: [{ test: /\.js$/, use: ['babel-loader'] }, { test: /\.css$/, use: ['style-loader', 'css-loader'] }],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: './index.html',
		}),
	],
};
