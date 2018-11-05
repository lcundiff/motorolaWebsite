'use strict';

module.exports = function (app) {
  // User Routes
  var files = require('../controllers/files.server.controller');

  // Setting up the users profile api
  app.route('/api/files/upload').post(files.uploadFile);
  app.route('/api/files/uploadNDA').post(files.uploadNDA);
  app.route('/api/files/uploadWaiver').post(files.uploadWaiver);
  app.route('/api/files/get/:filename').get(files.downloadFile);

};
