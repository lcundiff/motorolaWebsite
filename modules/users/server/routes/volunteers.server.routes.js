'use strict';

/**
 * Module dependencies
 */
var volunteersPolicy = require('../policies/volunteers.server.policy'),
  volunteers = require('../controllers/users/volunteers/volunteers.server.controller');

module.exports = function(app) {
  // Volunteers Routes
  app.route('/api/volunteers').all(volunteersPolicy.isAllowed)
    .get(volunteers.list)
    .post(volunteers.create);

  app.route('/api/volunteers/listMentors')
    .get(volunteers.listMentors);

  app.route('/api/volunteers/all').all(volunteersPolicy.isAllowed)
    .get(volunteers.listAll);

  app.route('/api/volunteers/deactivated').all(volunteersPolicy.isAllowed)
    .get(volunteers.listDeactivated);

  app.route('/api/volunteers/:volunteerId').all(volunteersPolicy.isAllowed)
    .get(volunteers.read)
    .put(volunteers.update)
    .delete(volunteers.delete);

  /*app.route('/api/volunteers/updateRank/:volId/:studentId/:rank')
    .get(volunteers.updateRank);*/

  // Finish by binding the Volunteer middleware
  app.param('volunteerId', volunteers.volunteerByID);
};
