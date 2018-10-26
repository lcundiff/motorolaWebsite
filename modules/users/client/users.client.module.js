(function (app) {
  'use strict';

  app.registerModule('users');

  app.registerModule('users.admin');
  app.registerModule('users.admin.routes', ['ui.router', 'core.routes', 'users.admin.services']);
  app.registerModule('users.admin.services');

  app.registerModule('users.student');
  app.registerModule('users.student.routes', ['ui.router', 'core.routes', 'users.student.services']);
  app.registerModule('users.student.services');

  app.registerModule('users.routes', ['ui.router', 'core.routes']);
  app.registerModule('users.services');
}(ApplicationConfiguration));
