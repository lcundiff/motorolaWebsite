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

  }
}());
