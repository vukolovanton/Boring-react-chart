const path = require('path');
const pkg = require('./package.json');

module.exports = {
	mode: 'production',
	entry: './lib/cjs/components/BoringChart',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'BoringChart.js',
		library: pkg.name,
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			react: path.resolve(__dirname, './node_modules/react'),
			'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
		},
	},
	externals: {
		// Don't bundle react or react-dom
		react: {
			commonjs: 'react',
			commonjs2: 'react',
			amd: 'React',
			root: 'React',
		},
		'react-dom': {
			commonjs: 'react-dom',
			commonjs2: 'react-dom',
			amd: 'ReactDOM',
			root: 'ReactDOM',
		},
	},
};
