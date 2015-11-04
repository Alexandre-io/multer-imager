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
    accessKeyId: 'aws-key-id',
    secretAccessKey: 'aws-key',
    region: 'us-east-1',
    gm: {
      format: 'png',
      scale: {
        width: 200,
        height: 200,
        type: 'contain'
      }
    },
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4568')
  })
});

var upload2 = multer({
  storage: multers3({
    dirname: 'avatars',
    bucket: 'bucket-name',
    accessKeyId: 'aws-key-id',
    secretAccessKey: 'aws-key',
    region: 'us-east-1',
    gm: {
      format: 'png',
      scale: {
        width: 200,
        height: 200,
        type: 'contain'
      }
    },
    s3ForcePathStyle: true,
    filename: function(req, file, cb) {
      cb(null, 'fileNameOne');
    },
    endpoint: new AWS.Endpoint('http://localhost:4568')
  })
});

// express setup
app.post('/upload', upload.array('avatars', 3), function(req, res, next) {
  lastReq = req;
  lastRes = res;
  res.status(200).send();
});

// express setup
app.post('/uploadWithFilename', upload2.array('avatars', 3), function(req, res, next) {
  lastReq = req;
  lastRes = res;
  res.status(200).send();
});

describe('express', function() {
  it('successfully uploads a file', function(done) {
    supertest(app)
      .post('/upload')
      .attach('avatars', 'test/fixtures/pixel.png')
      .expect(200, done);
  });
  it('returns a req.files with the s3 filename and location', function(done) {
    supertest(app)
      .post('/upload')
      .attach('avatars', 'test/fixtures/pixel.png')
      .end(function(err, res) {
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
      .attach('avatars', 'test/fixtures/pixel.png')
      .end(function(err, res) {
        lastReq.files.map(function(file) {
          file.should.have.property('key');
          file.key.should.have.string('avatars/fileNameOne');
          file.location.should.have.string('amazon');
        });
        done();
      });
  });
});
