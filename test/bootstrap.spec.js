var S3rver = require('s3rver');
var path = require('path');
var s3rver = new S3rver({
  port: 4568,
  hostname: 'localhost',
  silent: true,
  allowMismatchedSignatures: true,
  directory: path.resolve(__dirname, '.tmp')
});
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

before(function (done) {
  s3rver.run(function (err) {
    if (err) {
      return done(err);
    }
    mkdirp(path.resolve(__dirname, '.tmp/bucket-name')).then(() => {
      return done();
    });
  });
});

after(function (done) {
  rimraf(path.resolve(__dirname, '.tmp/bucket-name'), done);
});