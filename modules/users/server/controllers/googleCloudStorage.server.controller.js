var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');
var FormData = require('form-data');

const {Storage} = require('@google-cloud/storage');

const projectId = 'test-new-moto';
const bucketName = 'test-new-moto.appspot.com';

const storage = new Storage({projectId});

var mStorage = multer.memoryStorage()
var upload = multer({ storage: mStorage }).single("file");

exports.uploadCloudFile = function(req, res) {

  upload(req, res, function(error){
    console.log("FIIIIIIILE", req.file);
    console.log('buffer: ', req.file.buffer);
    console.log('contentType: ', req.file.mimetype);
    console.log('encoding: ', req.file.encoding);


    storage.bucket(bucketName).file(req.params.filename).save(req.file.buffer, {
      metadata: {
        gzip: true,
        contentType: req.file.mimetype,
        contentEncoding: 'gzip',
        //contentEncoding: req.file.encoding,
        cacheControl: 'no-cache'
      }
    })
    .then(function(response){
      console.log('something right');
      console.log(response);
      return res.status(200).end();
    })
    .catch(function(error){
      console.log('something wrong');
      console.log(error);
      return res.status(406).end();
    });
  });

};

// Downloads the file
exports.downloadCloudFile = function(req, res) {
  const options = {
    destination: `./uploads/${req.params.filename}`,
  };

  storage
    .bucket(bucketName)
    .file(`${req.params.filename}`)
    .download(options)
    .then(function(response){
      console.log('gcs download right: ', response);
      res.download(`./uploads/${req.params.filename}`);
      return res.status(200).end();
    })
    .catch(function(error){
      console.log('gcs download wrong: ', error);
      return res.status(406).end();
    });
};
