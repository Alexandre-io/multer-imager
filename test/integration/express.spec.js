var express = require('express');
var app = express();
var supertest = require('supertest');
var multers3 = require('../../index');
var multer = require('multer');
var should = require('chai').should();
var AWS = require('aws-sdk');
var lastRes = null;
var lastReq = lastRes;

var upload = multer({
  storage: multers3({
    dirname: 'avatars',
    bucket: 'bucket-name',
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    region: 'us-east-1',
    gm: {
      width: 200,
      height: 200,
      options: '!'
    },
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4568')
  })
});

var upload2 = multer({
  storage: multers3({
    dirname: 'avatars',
    bucket: 'bucket-name',
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    region: 'us-east-1',
    gm: {
      width: 200,
      height: 200,
      options: '!'
    },
    s3ForcePathStyle: true,
    filename: function(req, file, cb) {
      cb(null, 'fileNameOne');
    },
    endpoint: new AWS.Endpoint('http://localhost:4568')
  })
});

var upload3 = multer({
  storage: multers3({
    dirname: 'avatars',
    bucket: 'bucket-name',
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    region: 'us-east-1',
    gm: {
      format: 'png'
    },
    s3 : {
      Metadata: { // "customMetaData":[{"key":"x-amz-meta-custom","value":"metadata"}]
        'custom': 'metadata'
      }
    },
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4568')
  })
});

// express setup
app.post('/upload', upload.array('avatars', 3), function(req, res, next) {
  lastReq = req;
  lastRes = res;
  res.status(200).send();
  next();
});

// express setup
app.post('/uploadWithFilename', upload2.array('avatars', 3), function(req, res, next) {
  lastReq = req;
  lastRes = res;
  res.status(200).send();
  next();
});

// express setup
app.post('/uploadWithoutOption', upload3.array('avatars', 3), function(req, res, next) {
  lastReq = req;
  lastRes = res;
  res.status(200).send();
  next();
});

describe('express', function() {
  it('successfully uploads a file', function(done) {
    supertest(app)
      .post('/upload')
      .attach('avatars', 'test/pixel.png')
      .expect(200, done);
  });
  it('returns a req.files with the s3 filename and location', function(done) {
    supertest(app)
      .post('/upload')
      .attach('avatars', 'test/pixel.png')
      .end(function() {
        lastReq.files.map(function(file) {
          file.should.have.property('key');
          file.key.should.have.string('avatars');
          file.location.should.have.string('amazon');
        });
        done();
      });
  });
  it('return a req.files with the optional filename', function(done) {
    supertest(app)
      .post('/uploadWithFilename')
      .attach('avatars', 'test/pixel.png')
      .end(function() {
        lastReq.files.map(function(file) {
          file.should.have.property('key');
          file.key.should.have.string('avatars/fileNameOne');
          file.location.should.have.string('amazon');
        });
        done();
      });
  });

  it('return a req.files without options', function(done) {
    supertest(app)
      .post('/uploadWithoutOption')
      .attach('avatars', 'test/pixel.png')
      .end(function() {
        lastReq.files.map(function(file) {
          file.should.have.property('key');
          file.key.should.have.string('avatars');
          file.location.should.have.string('amazon');
        });
        done();
      });
  });
});
