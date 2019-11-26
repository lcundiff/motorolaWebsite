'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = function (app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  /* this code is used to initialize functions that allow for social media connection. This came with MEAN boiler plate to authenticate in several ways
     we are only using local.js right now, but Facebook would be cool in the future */
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/local.js')).forEach(function (strategy) { // Glob string used to be './strategies/**/*.js'
    require(path.resolve(strategy))(config);
  });
  
  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
