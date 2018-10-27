'use strict';

module.exports = function (app) {
  // User Routes
  var files = require('../controllers/files.server.controller');

  // Setting up the users profile api
  app.route('/api/files/upload').post(files.uploadFile);
};
