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

You can pass options when constructing a new plugin, for example `ArchivePlugin(options)`.

The options object supports the following properties:

| Prop		| Type			| Description
| ----		| ----			| ----
| output	| string		| Output location / name of archives (without extension)
| format	| string OR Array	| Archive formats to use, can be `'tar'` or `'zip'`

If `options` is a string, this is eqiuvalent to passing `{output: options}`.
