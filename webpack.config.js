/**
 * Webpack Configuration
 *
 * Webpack basics — If you are new the Webpack here's all you need to know:
 *     1. Webpack is a module bundler. It bundles different JS modules together.
 *     2. It needs and entry point and an ouput to process file(s) and bundle them.
 *     3. By default it only understands common JavaScript but you can make it
 *        understand other formats by way of adding a Webpack loader.
 *     4. In the file below you will find an entry point, an ouput, and a babel-loader
 *        that tests all .js files excluding the ones in node_modules to process the
 *        ESNext and make it compatible with older browsers i.e. it converts the
 *        ESNext (new standards of JavaScript) into old JavaScript through a loader
 *        by Babel.
 *
 * Instructions: How to build or develop with this Webpack config:
 *     1. In the command line browse the folder where
 *        this `webpack.config.js` file is present.
 *     2. Run the `npm run dev` for development.
 *     3. To read what these NPM Scripts do, read the `package.json` file.
 *
 * @since 1.0.0
 */

module.exports = {
	entry: './block/block.jsx', // Webpack
	output: {
		path: __dirname + '/block/',
		filename: 'block.build.js',
	},
	module: {
		loaders: [
			{
				test: /.jsx$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
};
