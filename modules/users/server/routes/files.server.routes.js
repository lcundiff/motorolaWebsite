'use strict';

module.exports = function (app) {
  // User Routes
  var files = require('../controllers/files.server.controller');
  var googleCloudStorage = require('../controllers/googleCloudStorage.server.controller');

  // Setting up the users profile api
  app.route('/api/files/upload/:filename').post(files.uploadFile);
  app.route('/api/files/uploadNDA').post(files.uploadNDA);
  app.route('/api/files/uploadWaiver').post(files.uploadWaiver);
  app.route('/api/files/get/:filename').get(files.downloadFile);
  app.route('/api/files/csv/get/:filename').get(files.downloadCSV);
  app.route('/api/files/cloud-storage/:filename').put(googleCloudStorage.uploadCloudFile);
  app.route('/api/files/cloud-storage/:filename').get(googleCloudStorage.downloadCloudFile);

};
