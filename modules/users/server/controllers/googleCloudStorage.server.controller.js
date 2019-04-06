var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');

const {Storage} = require('@google-cloud/storage');

const projectId = 'test-new-moto';
const bucketName = 'test-new-moto.appspot.com';

const storage = new Storage({projectId});

exports.uploadCloudFile = async function(req, res) {
  console.log('yeEEEEEEEEE: ',req.body);
  console.log(`./uploads/${req.body.name}`);
  storage.bucket(bucketName).upload(`./uploads/${req.body.name}`, {
    gzip: false,
    metadata: {
      cacheControl: 'no-cache',
    },
  })
  .then(function(response){
    return res.status(200).end();
  })
  .catch(function(error){
    return res.status(406).end();
  });
};

// Downloads the file
exports.downloadCloudFile = async function(req, res) {
  console.log('yeEEEE: ',req.params);
  const options = {
    destination: `./downloads/${req.params.filename}`,
  };

  storage
    .bucket(bucketName)
    .file(`${req.params.filename}`)
    .download(options)
    .then(function(response){
      return res.status(200).end();
    })
    .catch(function(error){
      return res.status(406).end();
    });
};
