(function () {
  'use strict';

  angular
    .module('users.student')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    /*menuService.addSubMenuItem('topbar', 'student', {
      title: 'Something',
      state: 'student.application'
    });*/
    menuService.addMenuItem('topbar', {
      title: 'Dashboard',
      state: 'student.dash',
      roles: ['student']
    });
	  
    menuService.addMenuItem('topbar', {
      title: 'Application',
      state: 'student.application',
      roles: ['student']
    });

    menuService.addMenuItem('topbar', {
      title: 'Forms',
      state: 'student.forms',
      roles: ['student']
    });

  }
}());
