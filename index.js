let path = require('path');
let fs = require('fs');
let archiver = require('archiver');

function WebpackArchivePlugin(options) {
}

WebpackArchivePlugin.prototype.apply = function(compiler) {
	compiler.plugin("after-emit", function(compiler, callback) {
		let output = compiler.options.output.path;

		// Create tarfile
		let tar = archiver('tar');
		tar.pipe(fs.createWriteStream(`${output}.tar.gz`));

		for(let asset in compiler.assets) {
			console.log(asset);
			tar.append(fs.createReadStream(file1), {name: 'file1.txt'});
		}

		tar.finalize();

		callback();
	});
}

module.exports = WebpackArchivePlugin;
