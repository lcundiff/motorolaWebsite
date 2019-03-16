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
  await storage.bucket(bucketName).upload(`${req.body.name}`, {
    gzip: false,
    metadata: {
      cacheControl: 'no-cache',
    },
  });

  return res.status(200).end();
};

// Downloads the file
exports.downloadCloudFile = async function(req, res) {
  console.log('yeEEEE: ',req.params);
  const options = {
    destination: `./downloads/${req.params.filename}.pdf`,
  };

  await storage
    .bucket(bucketName)
    .file(`${req.params.filename}.pdf`)
    .download(options);

  return res.status(200).end();
};
