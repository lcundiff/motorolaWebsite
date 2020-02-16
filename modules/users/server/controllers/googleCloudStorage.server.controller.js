var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');

const {Storage} = require('@google-cloud/storage');

// TODO pull this from development.js or production.js depending on env (still need to set up envs as well)
const projectId = 'motorola-new';
const bucketName = 'motorola-new.appspot.com';
const keyPath = 'moto-key.json';
const storage = new Storage({
  projectId: projectId,
  keyFilename: keyPath
});

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
        contentType: req.file.mimetype,
        contentEncoding: req.file.encoding,
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
    .createReadStream()
    .on('error', function(err){
      console.log(err);
      return res.status(406).end();
    })
    .on('response', function(response){
      console.log(response);
    })
    .on('end', function(){
      console.log('end');
    })
    .pipe(fs.createWriteStream(`./uploads/${req.params.filename}`))
    .on('finish', function(){
      console.log('PIPE FINISHED');
      res.download(`./uploads/${req.params.filename}`);
      console.log('yoyoyo');
    });
    /*.download(options)
    .then(function(response){
      console.log('gcs download right: ', response);
      res.download(`./uploads/${req.params.filename}`);
      console.log('yoyoyo');
      return res.status(200).end();
    })
    .catch(function(error){
      console.log('gcs download wrong: ', error);
      return res.status(406).end();
    });*/
};
