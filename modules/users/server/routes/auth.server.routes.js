'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers//users/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  app.route('/api/auth/sendFormFixEmail').post(users.sendFormFixEmail);

  // Setting up the users authentication api
  app.route('/api/auth/sendSignup').post(users.signupLink);
  app.route('/api/auth/signup/:token').get(users.validateSignupToken);
  app.route('/api/auth/signup').post(users.signup);
  app.route('/api/auth/signup/student').post(users.studentSignup);
  app.route('/api/auth/signup-request').post(users.requestLink);
  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);

};
