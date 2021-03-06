'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  School = mongoose.model('School'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
/**
 * routes refers to this controller only, so we need to add all other exports to this controller
 */
module.exports = _.extend(
  require('./admin.server.controller.js'),
  require('./automate.server.controller.js'),
  require('./admin.analytics.server.controller.js')
);
/**
 * Create an Admin
 */
exports.create = function(req, res) {
  var admin = new Admin(req.body);
  admin.user = req.user;

  admin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * Show the current Admin
 */
exports.readA = function(req, res) {
  // convert mongoose document to JSON
  var admin = req.admin ? req.admin.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  admin.isCurrentUserOwner = req.user && admin.user && admin.user._id.toString() === req.user._id.toString();

  res.jsonp(admin);
};

/**
 * Update a Admin
 */
exports.updateA = function(req, res) {
  var admin = req.admin;

  admin = _.extend(admin, req.body);

  admin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * Delete an Admin
 */
exports.deleteA = function(req, res) {
  var admin = req.admin;

  admin.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * List of Admins
 */
exports.listA = function(req, res) {
  Admin.find().sort('-created').populate('user', 'displayName').exec(function(err, admins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admins);
    }
  });
};

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Admin is invalid'
    });
  }

  Admin.findById(id).populate('user', 'displayName').exec(function(err, admin) {
    if (err) {
      return next(err);
    } else if (!admin) {
      return res.status(404).send({
        message: 'No Admin with that identifier has been found'
      });
    }
    req.admin = admin;
    next();
  });
};

