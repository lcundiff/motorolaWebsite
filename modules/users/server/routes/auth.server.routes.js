'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/sendSignup').post(users.signupLink);
  app.route('/api/auth/signup_admin').post(users.signup_admin);
  app.route('/api/auth/signup_volunteer').post(users.signup_volunteer);
  app.route('/api/auth/signup_student/:token').get(users.validateSignupToken);
  app.route('/api/auth/signup_student/:token').post(users.signup_student);
  app.route('/api/auth/signup-request').post(users.requestLink);
  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);

};
