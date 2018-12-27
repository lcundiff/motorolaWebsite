(function () {
  'use strict';

  angular
    .module('users.volunteer')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {

    menuService.addMenuItem('topbar', {
      title: 'Application',
      state: 'volunteer.application',
      roles: ['volunteer']
    });

    menuService.addMenuItem('topbar', {
      title: 'Interviews',
      state: 'volunteer.application',
      roles: ['interviewer']
    });

    menuService.addMenuItem('topbar', {
      title: 'Mentorship',
      state: 'volunteer.application',
      roles: ['mentor']
    });

  }
}());
