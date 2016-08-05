let path = require('path');
let fs = require('fs');
let archiver = require('archiver');

function WebpackArchivePlugin(options) {
}

WebpackArchivePlugin.prototype.apply = function(compiler) {
	compiler.plugin("after-emit", function(compiler, callback) {
		let output = compiler.options.output.path;

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

		//
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
