var S3FS = require('s3fs');
var crypto = require('crypto');
var gm = require('graphicsmagick-stream');
var _ = require("lodash");

function S3Storage(opts) {
  if (!opts.bucket) throw new Error('bucket is required');
  if (!opts.secretAccessKey) throw new Error('secretAccessKey is required');
  if (!opts.accessKeyId) throw new Error('accessKeyId is required');
  if (!opts.region) throw new Error('region is required');
  if (!opts.dirname) throw new Error('dirname is required');
  if (!opts.gm) throw new Error('gm is required');
  this.options = opts;
  this.s3fs = new S3FS(opts.bucket, opts);
  this.convert = gm(opts.gm);
}

S3Storage.prototype._handleFile = function(req, file, cb) {
  var self = this;
  var fileName;
  if (self.options.reqfilename) {
    fileName = _.get(req, self.options.reqfilename);
  }
  else {
    fileName = crypto.randomBytes(20).toString('hex');
  }
  var filePath = self.options.dirname + '/' + fileName;
  var outStream = self.s3fs.createWriteStream(filePath);
  file.stream
    .pipe(self.convert())
    .pipe(outStream);
  outStream.on('error', cb);
  outStream.on('finish', function() {
    cb(null, {
      size: outStream.bytesWritten,
      key: filePath,
      location: 'https://' + self.options.bucket + '.s3.amazonaws.com/' + filePath
    });
  });
};

S3Storage.prototype._removeFile = function(req, file, cb) {
  this.s3fs.unlink(file.key, cb);
};

module.exports = function(opts) {
  return new S3Storage(opts);
};
