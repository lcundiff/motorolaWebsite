var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');

const {Storage} = require('@google-cloud/storage');

const projectId = 'test-new-moto';
const bucketName = 'test-new-moto.appspot.com';

const storage = new Storage({projectId});

exports.uploadCloudFile = function(req, res) {
  storage.bucket(bucketName).upload(`./uploads/${req.body.name}`, {
    gzip: false,
    metadata: {
      cacheControl: 'no-cache',
    },
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
};

// Downloads the file
exports.downloadCloudFile = function(req, res) {
  const options = {
    destination: `./downloads/${req.params.filename}`,
  };

  storage
    .bucket(bucketName)
    .file(`${req.params.filename}`)
    .download(options)
    .then(function(response){
      console.log('gcs download right: ', response);
      return res.status(200).end();
    })
    .catch(function(error){
      console.log('gcs download wrong: ', error);
      return res.status(406).end();
    });
};
