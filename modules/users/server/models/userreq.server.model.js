'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  chalk = require('chalk');

owasp.config(config.shared.owasp);


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * A Validation function for username
 * - at least 3 characters
 * - only a-z0-9_-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok, ".." nope
 * - not begin or end with "."
 */



/**
 * User Schema
 */
var UserReqSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  signupLinkToken: {
    type: String
  },
  signupLinkExpires: {
    type: Date
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin', 'volunteer', 'student']
    }]
  }
});


mongoose.model('UserReq', UserReqSchema);
