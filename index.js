var S3FS = require('s3fs');
var crypto = require('crypto');
var gm = require('graphicsmagick-stream');
var _ = require("lodash");

var options = {};
var s3fs;
var convert;

function S3Storage(opts) {
  if (!opts.bucket) throw new Error('bucket is required');
  if (!opts.secretAccessKey) throw new Error('secretAccessKey is required');
  if (!opts.accessKeyId) throw new Error('accessKeyId is required');
  if (!opts.region) throw new Error('region is required');
  if (!opts.dirname) throw new Error('dirname is required');
  if (!opts.gm) throw new Error('gm is required');
  options = opts;
  s3fs = new S3FS(options.bucket, options);
  convert = gm(options.gm);
}

S3Storage.prototype._handleFile = function(req, file, cb) {
  var fileName;
  if (options.reqfilename) {
    fileName = _.get(req, options.reqfilename);
  }
  else {
    fileName = crypto.randomBytes(20).toString('hex');
  }
  var outStream = s3fs.createWriteStream(options.dirname + '/' + fileName);
  file.stream
    .pipe(convert())
    .pipe(outStream);
  outStream.on('error', cb);
  outStream.on('finish', function() {
    cb(null, {
      size: outStream.bytesWritten,
      key: options.dirname + '/' + fileName,
      location: 'https://' + options.bucket + '.s3.amazonaws.com/' + options.dirname + '/' + fileName
    });
  });
};

S3Storage.prototype._removeFile = function(req, file, cb) {
  s3fs.unlink(file.path, cb);
};

module.exports = function(opts) {
  return new S3Storage(opts);
};
