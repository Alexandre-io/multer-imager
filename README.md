# multer-imager
Imager multer storage engine permit to resize and upload an image to AWS S3.

This project is mostly an integration piece for existing code samples from Multer's [storage engine documentation](https://github.com/expressjs/multer/blob/master/StorageEngine.md).
And based on [multer-s3](https://github.com/badunk/multer-s3) and [graphicsmagick-stream](https://github.com/e-conomic/graphicsmagick-stream)

# Requirements
## Debian/Ubuntu
```
apt-get install build-essential libgraphicsmagick++1-dev libarchive-dev
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
    reqfilename: 'user._id',  // Optional: define image name (req.user._id)
    gm: {
          pool: 5,             // how many graphicsmagick processes to use 
          format: 'png',       // format to convert to 
          scale: {
            width: 200,        // scale input to this width 
            height: 200,       // scale input this height 
            type: 'contain'    // scale type (either contain/cover/fixed) 
          },
          crop: {
            width: 200,        // crop input to this width 
            height: 200,       // crop input this height 
            x: 0,              // crop using this x offset 
            y: 0               // crop using this y offset 
          },
          page: [1,5],         // only render page 1 to 5 (for pdfs) 
                               // set to a single number if you only want to render one page 
                               // or omit if you want all pages 
          rotate: 'auto',      // auto rotate image based on exif data 
                               // or use rotate:degrees 
          density: 300,        // set the image density. useful when converting pdf to images 
          split: false,        // when converting pdfs into images it is possible to split 
                               // into multiple pages. If set to true the resulting file will 
                               // be a tar containing all the images. 
          tar: false           // stream a tar containing the image. This is forced to `true` 
                               // if split is set to `true` 
        }
  })
});

// Cf.: https://github.com/expressjs/multer/blob/master/README.md
app.post('/upload', upload.array('file', 1), function(req, res, next){ 
  console.log(req.files); // Print upload details
  res.send('Successfully uploaded!');
});
```
