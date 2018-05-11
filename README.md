# webpack-archive-plugin

Webpack plugin to create archives of emitted files.

## Installation

    npm install --save-dev webpack-archive-plugin

## Usage

webpack.config.js:

```javascript
let ArchivePlugin = require('webpack-archive-plugin');

module.exports = {
	// configuration
	output: {
		path: __dirname + '/dist',
	},
	plugins: [
		new ArchivePlugin(),
	],
}
```

Will create two archives in the same directory as output.path (`__dirname` in the example),
`${output.path}.tar.gz` and `${output.path}.zip` containing all compiled assets.

## Options

You can pass options when constructing new instance of the plugin, for example `ArchivePlugin(options)`.

The options object supports the following properties:

- output: `string` -> Output location / name of archives (without extension)
- format: `string`, `array` -> Archive formats to use, can be `'tar'` or `'zip'`
- ext: `string` -> A different extension to use instead of `tar.gz` or `zip` (without leading `.`)
- filter: `Function<String>` -> Filter callback. Receives relative path of the asset as the first argument, must return truthy/falsy value to indicate if asset is to be included/not included in the archive. All files are included by default.

If `options` is a string, this is equivalent to passing `{output: options}`.
