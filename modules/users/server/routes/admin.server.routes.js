'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/users/admins/admins.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/user/:userId')
    .get(admin.read)
    .put(admin.update)
    .delete(admin.delete);

  app.route('/api/automate/autoMatch').get(admin.autoMatch);
  // from interviews
  app.route('/api/automate/autoAssignInterviews').put(admin.autoAssignInterviews);
  app.route('/api/automate/setInterviewer').put(admin.chooseInterviewer);
  app.route('/api/automate/replaceInterviewer').put(admin.replaceInterviewer);
  app.route('/api/automate/autoAssignInterviews').get(admin.autoAssignInterviews);
  app.route('/api/automate/manUnassignInterview').put(admin.manUnassignInterview);
  // from applicants
  app.route('/api/automate/autoAcceptAllStudents').put(admin.autoAcceptAllStudents);
  app.route('/api/automate/manAccept/:sessionNum').put(admin.manAccept);
  // from matching  
  app.route('/api/automate/manMatch').put(admin.manMatch);
  app.route('/api/automate/manUnmatch').put(admin.manUnmatch);
  app.route('/api/automate/autoMatch/:sessionNum').put(admin.autoMatch);
  // from the dashboard
  app.route('/api/analytics/newStudentActivity').get(admin.newStudentActivity);
  app.route('/api/analytics/completedStudentApps').get(admin.completedStudentApps);
  app.route('/api/analytics/completedStudentForms').get(admin.completedStudentForms);
  app.route('/api/analytics/newVolunteerActivity').get(admin.newVolunteerActivity);
  app.route('/api/analytics/newMentorActivity').get(admin.newMentorActivity);
  app.route('/api/analytics/newInterviewerActivity').get(admin.newInterviewerActivity);
  app.route('/api/analytics/completedVolunteerApps').get(admin.completedVolunteerApps);
  app.route('/api/updateSchools').put(admin.updateSchools);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
