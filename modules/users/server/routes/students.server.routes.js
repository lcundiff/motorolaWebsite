'use strict';

module.exports = function (app) {
  // User Routes
  var students = require('../controllers/students.server.controller');

  // Setting up the users profile api
  app.route('/api/students/create').put(students.create);
  app.route('/api/students/read/:userId').get(students.read);
  app.route('/api/students/update/:userId').put(students.update);
  app.route('/api/students/delete/:userId').delete(students.delete);
  app.route('/api/students/list').get(students.list);
  app.route('/api/students/listDeactivated').get(students.listDeactivated);
  app.route('/api/students/listAccepted').get(students.listAccepted);
  app.route('/api/students/getByUsername/:username').get(students.getStudentByUsername);


  // Finish by binding the user middleware
  app.param('userId', students.studentByID);
};
