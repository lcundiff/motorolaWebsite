(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage User Requests',
      state: 'admin.userreqs'
    });
    menuService.addMenuItem('topbar', {
      title: 'Applicants',
      state: 'admin.students'
    });
    menuService.addMenuItem('topbar', {
      title: 'Forms',
      state: 'admin.approveForms'
    })
    menuService.addMenuItem('topbar', {
      title: 'Volunteers',
      state: 'admin.volunteers'
    });
    menuService.addMenuItem('topbar', {
      title: 'Interviews',
      state: 'admin.students'
    });
    menuService.addMenuItem('topbar', {
      title: 'Match',
      state: 'admin.students'
    });
    menuService.addMenuItem('topbar', {
      title: 'E-mail',
      state: 'admin.students'
    })
  }
}());
