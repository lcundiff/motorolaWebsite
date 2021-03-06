'use strict';

/**
 * Module dependencies
 */
var volunteersPolicy = require('../policies/volunteers.server.policy'),
  volunteers = require('../controllers/users/volunteers/volunteers.server.controller');

module.exports = function(app) {
  // Volunteers Routes
  app.route('/api/volunteers')
    .get(volunteers.list)
    .post(volunteers.create);

  app.route('/api/volunteers/listMentors')
    .get(volunteers.listMentors);

  app.route('/api/volunteers/all')
    .get(volunteers.listAll);

  app.route('/api/volunteers/deactivated')
    .get(volunteers.listDeactivated);

  app.route('/api/volunteers/:userId')
    .get(volunteers.read)
    .delete(volunteers.delete);

  app.route('/api/volunteers/update/:username')
    .put(volunteers.update);

  app.route('/api/volunteers/getByUser/:username')
    .get(volunteers.volunteerByUsername);

  app.route('/api/volunteers/:username/interviews/interviewees').get(volunteers.getVolunteerInterviewees);

  app.route('/api/volunteers/:username/mentorship/mentees').get(volunteers.getVolunteerMentees);

  /*app.route('/api/volunteers/updateRank/:volId/:studentId/:rank')
    .get(volunteers.updateRank);*/

  // Finish by binding the Volunteer middleware
  app.param('volunteerId', volunteers.volunteerByID);
};
