'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./admins/admin.server.controller.js'),
  require('./admins/admins.server.controller.js'),
  require('./admins/automate.server.controller.js')
);
