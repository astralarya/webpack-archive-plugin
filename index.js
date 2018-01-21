'use strict'

const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const mkdirp = require('mkdirp')

function WebpackArchivePlugin (options) {
  this.options = options || {}
}

WebpackArchivePlugin.prototype.apply = function (compiler) {
  const defaultOptions = {
    // output location can be relative (to Webpack output path) or absolute
    output: compiler.options.output.path,

    // output filename without extension,
    // if not present, use the basename of the path
    filename: '',

    // String|Array
    // Archive formats to use, can be 'tar' or 'zip'
    format: ['zip', 'tar'],

    // String|Array: output file extension,
    // if 'format' is Array, extension needs to be like { zip: 'zipext', tar: 'tarext' }
    extension: '',

    // the prefix for the files included in the archiver file
    pathPrefix: ''
  }
  const options = Object.assign(defaultOptions, this.options)

  if (options.pathPrefix && path.isAbsolute(options.pathPrefix)) {
    throw new Error('"pathPrefix" must be a relative path');
  }

  // default extension
  let extZip = 'zip'
  let extTar = 'tar.gz'
  if (Array.isArray(options.format) && options.extension) {
    extZip = options.extension.zip || extZip
    extTar = options.extension.tar || extTar
  }

  compiler.plugin('after-emit', function (compiler, callback) {
    const outputPath = path.resolve(compiler.options.output.path, options.output)
    const outputFilename = options.filename || compiler.options.output.filename || path.basename(outputPath)
    const outputPathAndFilename = path.resolve(outputPath, path.basename(outputFilename))

    // Build the output path folders
    mkdirp.sync(outputPath)

    // Create archive streams
    let streams = []
    let zip = true
    let tar = true
    if (options.format) {
      if (typeof options.format === 'string') {
        zip = (options.format === 'zip')
        tar = (options.format === 'tar')
      } else if (Array.isArray(options.format)) {
        zip = (options.format.indexOf('zip') !== -1)
        tar = (options.format.indexOf('tar') !== -1)
      }
    }
    if (zip) {
      let stream = archiver('zip')
      stream.pipe(fs.createWriteStream(`${outputPathAndFilename}.${extZip}`))
      streams.push(stream)
    }
    if (tar) {
      let stream = archiver('tar', {
        gzip: true,
        gzipOptions: {
          level: 1
        }
      })
      stream.pipe(fs.createWriteStream(`${outputPathAndFilename}.${extTar}`))
      streams.push(stream)
    }

    // Add assets
    for (let asset in compiler.assets) {
      if (compiler.assets.hasOwnProperty(asset)) {
        for (let stream of streams) {
          stream.append(fs.createReadStream(compiler.assets[asset].existsAt), {
            name: path.join(options.pathPrefix, asset)
          })
        }
      }
    }

    // Finalize streams
    for (let stream of streams) {
      stream.finalize()
    }

    callback()
  })
}

module.exports = WebpackArchivePlugin
