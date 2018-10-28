'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admins.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/automate/autoMatch').get(admin.autoMatch);

  app.route('/api/automate/setInterviewer').put(admin.chooseInterviewer);
  app.route('/api/automate/replaceInterviewer').put(admin.replaceInterviewer);
  app.route('/api/automate/autoAssignInterviews').get(admin.autoAssignInterviews);
  app.route('/api/automate/manUnassignInterview').put(admin.manUnassignInterview);

  app.route('/api/automate/autoAcceptAllStudents').put(admin.autoAcceptAllStudents);
  app.route('/api/automate/manAccept').put(admin.manAccept);

  app.route('/api/automate/manMatch').put(admin.manMatch);
  app.route('/api/automate/manUnmatch').put(admin.manUnmatch);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
