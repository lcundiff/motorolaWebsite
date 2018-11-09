'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/list-userreqs').get(users.listReq);
  app.route('/api/users/get-req/:reqId').get(users.readReq);
  app.route('/api/users/update-req/:reqId').put(users.updateReq);
  app.route('/api/users/delete-userreq').delete(users.deleteReq);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
