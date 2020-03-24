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
  app.route('/api/students/listActive').get(students.listActive);
  app.route('/api/students/listFormsNotApproved').get(students.listFormsNotApproved);
  app.route('/api/students/listActiveWithoutForms').get(students.listActiveWithoutForms);
  app.route('/api/students/listDeactivated').get(students.listDeactivated);
  app.route('/api/students/listOld').get(students.listOld);
  app.route('/api/students/listNonActiveWithoutForms').get(students.listNonActiveWithoutForms);
  app.route('/api/students/listAccepted').get(students.listAccepted);
  app.route('/api/students/getByUsername/:username').get(students.getStudentByUsername);
  app.route('/api/students/closeApps').get(students.closeStudentApps);
  app.route('/api/students/checkApps').get(students.checkAppsClosed);
  app.route('/api/getSchools').get(students.getSchools);

  // Finish by binding the user middleware
  //app.param('userId', students.studentByID);
};
