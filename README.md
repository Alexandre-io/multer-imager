# multer-imager [![Build Status](https://travis-ci.org/Alexandre-io/multer-imager.svg)](https://travis-ci.org/Alexandre-io/multer-imager) [![Codacy Badge](https://api.codacy.com/project/badge/grade/9692bba42b1d4977872ac34f068065a9)](https://www.codacy.com/app/alexandre_2/multer-imager)
Imager multer storage engine permit to resize and upload an image to AWS S3.

This project is mostly an integration piece for existing code samples from Multer's [storage engine documentation](https://github.com/expressjs/multer/blob/master/StorageEngine.md).
And was inspired from [multer-s3](https://github.com/badunk/multer-s3) and [gm](https://github.com/aheckmann/gm)

# Requirements
## Debian/Ubuntu
```
apt-get install graphicsmagick
```
## MacOS X
```
brew install graphicsmagick
```

# Install
```
npm install multer-imager --save
```

# Tests
Tested with [s3rver](https://github.com/jamhall/s3rver) instead of your actual s3 credentials.  Doesn't require a real account or changing of hosts files.  Includes integration tests ensuring that it should work with express + multer.

```
npm test
```

# Usage
```
var express = require('express');
var app = express();
var multer = require('multer');
var imager = require('multer-imager');

var upload = multer({
  storage: imager({
    dirname: 'avatars',
    bucket: 'bucket-name',
    accessKeyId: 'aws-key-id',
    secretAccessKey: 'aws-key',
    region: 'us-east-1',
    filename: function (req, file, cb) {  // [Optional]: define filename (default: random)
      cb(null, Date.now())                // i.e. with a timestamp
    },                                    //
    gm: {                                 // [Optional]: define graphicsmagick options
      width: 200,                         // doc: http://aheckmann.github.io/gm/docs.html#resize
      height: 200,
      options: '!',
      format: 'png'                       // Default: jpg
    },
    s3 : {                                // [Optional]: define s3 options
      Metadata: {                         // http://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPUT.html
        'customkey': 'data'               // "x-amz-meta-customkey","value":"data"
      }
    }
  })
});

// Cf.: https://github.com/expressjs/multer/blob/master/README.md
app.post('/upload', upload.array('file', 1), function(req, res, next){ 
  console.log(req.files); // Print upload details
  res.send('Successfully uploaded!');
});
```
