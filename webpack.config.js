const currentTask = process.env.npm_lifecycle_event
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCSSPlugins = [
	/**
	 * postcss-import should probably be used as the first plugin of your list.
	 * This way, other plugins will work on the AST as if there were only a single file to process,
	 */
	require('postcss-import'),
	require('postcss-hexrgba'),
	require('postcss-mixins'),
	require('postcss-nested'),
	require('postcss-simple-vars'),
	require('autoprefixer'),
]

const cssConfig = {
	test: /\.css$/i,
	use: [
		'css-loader',
		{
			loader: 'postcss-loader',
			options: {
				postcssOptions: {
					plugins: postCSSPlugins,
				},
			},
		},
	],
}

const pages = fse
	.readdirSync('./src')
	.filter((file) => {
		return file.endsWith('.html')
	})
	.map((page) => {
		return new HtmlWebpackPlugin({
			filename: page,
			template: `./src/${page}`,
		})
	})

const config = {
	entry: './src/js/index.js',
	plugins: pages,
	module: {
		rules: [
			cssConfig,
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react', '@babel/preset-env'],
					},
				},
			},
			// Images
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			// Fonts and SVGs
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		],
	},
}

if (currentTask === 'start') {
	cssConfig.use.unshift('style-loader')

	config.output = {
		filename: 'bundle.[hash].js',
		// using absolute path, output the bundle.js to the src folder,side by side by the index.html.
		path: path.resolve(__dirname, 'src'),
	}

	config.devServer = {
		// Middleware: modify html file and auto reload, full page reload
		before: (app, server) => {
			server._watch('./src/**/*.html')
		},
		contentBase: path.join(__dirname, 'src'),
		hot: true,
		port: 3000,
		historyApiFallback: true,
		// Let server to be accessible externally, allow mobile test
		host: '0.0.0.0',
	}

	config.mode = 'development'
	config.devtool = 'source-map'
}
class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

if (currentTask === 'build') {
	cssConfig.use.unshift(MiniCssExtractPlugin.loader)

	postCSSPlugins.push(require('cssnano'))

	config.output = {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	}

	config.mode = 'production'

	config.optimization = {
		splitChunks: { chunks: 'all' },
	}

	config.plugins.push(
		new CleanWebpackPlugin(),
		// 將 css 從 js 中分離出來，主要用在build
		new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
		new RunAfterCompile()
	)
}

module.exports = config
