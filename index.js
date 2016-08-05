let path = require('path');
let fs = require('fs');
let targz = require('tar.gz');

function WebpackArchivePlugin(options) {
}

WebpackArchivePlugin.prototype.apply = function(compiler) {
	compiler.plugin("after-emit", function(compiler, callback) {
		let output = compiler.options.output.path;

		// Create tarfile
		let read = targz().createReadStream(output);
		let write = fs.createWriteStream(`${output}.tar.gz`);
		read.pipe(write);

		callback();
	});
}

module.exports = WebpackArchivePlugin;
