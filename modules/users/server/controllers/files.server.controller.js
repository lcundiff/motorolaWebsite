'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserReq = mongoose.model('UserReq'),
  multer = require('multer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

const uploadFolder = './uploads/';
const downloadFolder = './uploads/';

  var storage = multer.diskStorage({
      destination:function(req,file,cb){
          cb(null, './uploads');
      },
      filename:function(req,file,cb){
        console.log(req.params.filename);
        if (!file.originalname.match(/\.(pdf|doc|docx|pages)$/)){
          var err = new Error();
          err.code = 'filetype';
          return cb(err);
        } else {
          cb(null, req.params.filename);
        }
      }
  });

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 10000000
    }
  }).single('myFile');

  var storageNDA = multer.diskStorage({
      destination:function(req,file,cb){
          cb(null, './uploads');
      },
      filename:function(req,file,cb){
        if (!file.originalname.match(/\.(pdf|doc|docx|pages)$/)){
          var err = new Error();
          err.code = 'filetype';
          return cb(err);
        } else {
          cb(null, 'NDA.pdf');
        }
      }
  });

  var uploadNDA = multer({
    storage: storageNDA,
    limits: {
      fileSize: 10000000
    }
  }).single('myFile');

  var storageWaiver = multer.diskStorage({
      destination:function(req,file,cb){
          cb(null, './uploads');
      },
      filename:function(req,file,cb){
        if (!file.originalname.match(/\.(pdf|doc|docx|pages)$/)){
          var err = new Error();
          err.code = 'filetype';
          return cb(err);
        } else {
          cb(null, 'Waiver.pdf');
        }
      }
  });

  var uploadWaiver = multer({
    storage: storageWaiver,
    limits: {
      fileSize: 10000000
    }
  }).single('myFile');


exports.uploadFile = function(req, res){
  console.log("req.params: ",req.params.filename);
  var p1 = new Promise(function(resolve, reject){
    upload(req, res, function(err){
      if (err) {
        if(err.code === 'LIMIT_FILE_SIZE') res.json({ success: false, message: 'File size is too large. Max limit is 10MB.'});
        else if(err.code = 'filetype') res.json({ success: false, message: 'File type not permitted.'});
        else {
          resolve({ success: false, message: 'File upload error.'});
        }
      } else {
        //if (!req.file) res.json({ success: false, message: 'No file was selected.'});
       resolve({success: true, message: 'File successfully uploaded.', fileName: req.params.filename});
      }
    });
  });

  Promise.all([p1]).then(function(values){
    res.json(values[0]);
  });
}

exports.uploadNDA = function(req, res){
  var p1 = new Promise(function(resolve, reject){
    uploadNDA(req, res, function(err){
      if (err) {
        if(err.code === 'LIMIT_FILE_SIZE') res.json({ success: false, message: 'File size is too large. Max limit is 10MB.'});
        else if(err.code = 'filetype') res.json({ success: false, message: 'File type not permitted.'});
        else {
          resolve({ success: false, message: 'File upload error.'});
        }
      } else {
        //if (!req.file) res.json({ success: false, message: 'No file was selected.'});
       resolve({success: true, message: 'File successfully uploaded.', fileName: 'NDA.pdf'});
      }
    });
  });

  Promise.all([p1]).then(function(values){
    res.json(values[0]);
  });
}

exports.uploadWaiver = function(req, res){
  var p1 = new Promise(function(resolve, reject){
    uploadWaiver(req, res, function(err){
      if (err) {
        if(err.code === 'LIMIT_FILE_SIZE') res.json({ success: false, message: 'File size is too large. Max limit is 10MB.'});
        else if(err.code = 'filetype') res.json({ success: false, message: 'File type not permitted.'});
        else {
          resolve({ success: false, message: 'File upload error.'});
        }
      } else {
        //if (!req.file) res.json({ success: false, message: 'No file was selected.'});
       resolve({success: true, message: 'File successfully uploaded.', fileName: 'Waiver.pdf'});
      }
    });
  });

  Promise.all([p1]).then(function(values){
    res.json(values[0]);
  });
}

exports.downloadFile = function(req, res){
  console.log("JERE");
	res.download(`${downloadFolder}${req.params.filename}`);
}

exports.downloadCSV = function(req, res){
  console.log("req.params: ",req.params.filename);
  upload(req, res, function(err){
    if (err) {
      if(err.code === 'LIMIT_FILE_SIZE') res.json({ success: false, message: 'File size is too large. Max limit is 10MB.'});
      else if(err.code = 'filetype') res.json({ success: false, message: 'File type not permitted.'});
      else {
        res.json({ success: false, message: 'File upload error.'});
      }
    } else {
      //if (!req.file) res.json({ success: false, message: 'No file was selected.'});
     res.download(uploadFolder + req.params.filename);
    }
  });
}
