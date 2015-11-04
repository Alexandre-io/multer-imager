var multerS3 = require('../../index');
var should = require('chai').should();

describe('multer-imager', function() {
  it('is exposed as a function', function() {
    multerS3.should.be.a('function');
  });
  it('accepts s3 options', function() {
    multerS3({
      bucket: 'bucket',
      dirname: 'uploads/',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      region: 'region',
      gm: {
        format: 'png',
        scale: {
          width: 200,
          height: 200,
          type: 'contain'
        }
      }
    });
  });
  it('stores the options within each instance', function() {
    var multer = multerS3({
      bucket: 'bucket',
      dirname: 'uploads/',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      region: 'region',
      gm: {
        format: 'png',
        scale: {
          width: 200,
          height: 200,
          type: 'contain'
        }
      }
    });
    var multer2 = multerS3({
      bucket: 'bucket2',
      dirname: 'uploads/',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      region: 'region',
      gm: {
        format: 'png',
        scale: {
          width: 200,
          height: 200,
          type: 'contain'
        }
      }
    });
    multer.should.have.property('options');
    multer.options.bucket.should.equal('bucket');
    multer2.options.bucket.should.equal('bucket2');
  });
  it('implements _handleFile', function() {
    var upload = multerS3({
      bucket: 'bucket',
      dirname: 'uploads/',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      region: 'region',
      gm: {
        format: 'png',
        scale: {
          width: 200,
          height: 200,
          type: 'contain'
        }
      }
    });
    upload._handleFile.should.be.a('function');
  });
  it('implements _removeFile', function() {
    var upload = multerS3({
      bucket: 'bucket',
      dirname: 'uploads/',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      region: 'region',
      gm: {
        format: 'png',
        scale: {
          width: 200,
          height: 200,
          type: 'contain'
        }
      }
    });
    upload._removeFile.should.be.a('function');
  });
});
