'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

function WebpackArchivePlugin(options = {}) {
	this.options = options;
}

WebpackArchivePlugin.prototype.apply = function(compiler) {
	const options = this.options;
	compiler.plugin('after-emit', function(compiler, callback) {
		// Set output location
		const output = options.output?
			options.output:compiler.options.output.path;

		// Create archivers
		let zip = archiver('zip');
		zip.pipe(fs.createWriteStream(`${output}.zip`));
		let tar = archiver('tar', {
			gzip: true,
			gzipOptions: {
				level: 1
			}
		});
		tar.pipe(fs.createWriteStream(`${output}.tar.gz`));

		// Add assets
		for(let asset in compiler.assets) {
			if(compiler.assets.hasOwnProperty(asset)) {
				zip.append(fs.createReadStream(compiler.assets[asset].existsAt), {name: asset});
				tar.append(fs.createReadStream(compiler.assets[asset].existsAt), {name: asset});
			}
		}

		zip.finalize();
		tar.finalize();

		callback();
	});
}

module.exports = WebpackArchivePlugin;
