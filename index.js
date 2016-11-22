'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

function WebpackArchivePlugin(options = {}) {
	if(typeof options === 'string') {
		this.options = {output: options};
	} else {
		this.options = options;
	}
}

WebpackArchivePlugin.prototype.apply = function(compiler) {
	const options = this.options;
	compiler.plugin('after-emit', function(compiler, callback) {
		// Set output location
		const output = options.output?
			options.output:compiler.options.output.path;

		// Create archive streams
		let streams = [];
		let zip = true;
		let tar = true;
		if(options.format) {
			if(typeof options.format === 'string') {
				zip = (options.format === 'zip');
				tar = (options.format === 'tar');
			} else if(Array.isArray(options.format)) {
				zip = (options.format.indexOf('zip') != -1);
				tar = (options.format.indexOf('tar') != -1);
			}
		}
		if(zip) {
			let stream = archiver('zip');
			stream.pipe(fs.createWriteStream(`${output}.zip`));
			streams.push(stream);
		}
		if(tar) {
			let stream = archiver('tar', {
				gzip: true,
				gzipOptions: {
					level: 1
				}
			});
			stream.pipe(fs.createWriteStream(`${output}.tar.gz`));
			streams.push(stream);
		}

		// Add assets (if not excluded)
		if (!options.excludeAssets) {
			for(let asset in compiler.assets) {
				if(compiler.assets.hasOwnProperty(asset)) {
					for(let stream of streams) {
						stream.append(fs.createReadStream(compiler.assets[asset].existsAt), {name: asset});
					}
				}
			}
		}

		// Add additional targets
		if (Array.isArray(options.targets)) {
			options.targets.forEach(function(target) {
				for(let stream of streams) {
					stream.append(fs.createReadStream(target.from), {name: target.to});
				}
			});
		}

		// Finalize streams
		for(let stream of streams) {
			stream.finalize();
		}

		callback();
	});
}

module.exports = WebpackArchivePlugin;
